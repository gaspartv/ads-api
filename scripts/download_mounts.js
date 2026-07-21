const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const OUTPUT_DIR = path.join(process.cwd(), 'uploads', 'system', 'mounts');
const HTML_FILE_PATH = path.join(process.cwd(), 'mount.html');
const JSON_OUTPUT_PATH = path.join(process.cwd(), 'mounts.json');
const BASE_URL = 'https://www.tibiawiki.com.br';

function getOriginalImageUrl(url) {
  if (url.includes('/images/thumb/')) {
    let originalUrl = url.replace('/images/thumb/', '/images/');
    const lastSlashIndex = originalUrl.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      originalUrl = originalUrl.substring(0, lastSlashIndex);
    }
    return originalUrl;
  }
  return url;
}

async function downloadImageWithPage(page, url, filename) {
  try {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const imageBuffer = await page.evaluate(async (imgUrl) => {
      const response = await fetch(imgUrl);
      const arrayBuffer = await response.arrayBuffer();
      return Array.from(new Uint8Array(arrayBuffer));
    }, fullUrl);

    fs.writeFileSync(path.join(OUTPUT_DIR, filename), Buffer.from(imageBuffer));
    console.log(`Download concluído: ${filename}`);
  } catch (error) {
    console.error(`Erro ao baixar ${filename}:`, error.message);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(HTML_FILE_PATH)) {
    console.error(`Arquivo ${HTML_FILE_PATH} não encontrado.`);
    return;
  }

  const htmlContent = fs.readFileSync(HTML_FILE_PATH, 'utf-8');

  console.log('Iniciando o Puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    console.log(`Configurando origem para evitar CORS...`);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log(`Carregando HTML local...`);
    await page.setContent(htmlContent);

    // Extrair os dados da tabela
    const mountsData = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      const data = [];

      rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length >= 5) {
          // Extrai o nome (coluna 1)
          const nameEl = columns[0].querySelector('a');
          const name = nameEl ? nameEl.textContent.trim() : columns[0].textContent.trim();

          // Extrai a imagem src (coluna 2)
          const imgEl = columns[1].querySelector('img');
          const imageSrc = imgEl ? imgEl.getAttribute('src') : null;

          // Extrai a velocidade (coluna 5)
          const speedEl = columns[4].querySelector('small') || columns[4];
          let speedRaw = speedEl.textContent.trim();
          
          // O regex pega o primeiro conjunto de dígitos encontrado
          let speedMatch = speedRaw.match(/\d+/);
          let speed = speedMatch ? speedMatch[0] : "0";

          if (name && imageSrc) {
            data.push({ name, imageSrc, speed });
          }
        }
      });

      return data;
    });

    console.log(`Foram encontradas ${mountsData.length} montarias na página.`);

    const mountsJsonArray = [];
    let count = 0;

    for (const mount of mountsData) {
      let url = getOriginalImageUrl(mount.imageSrc);
      const decodedUrl = decodeURIComponent(url);
      const filename = path.basename(decodedUrl.split('?')[0]); 
      
      if (filename.match(/\.(png|gif|jpe?g|webp)$/i)) {
        await downloadImageWithPage(page, url, filename);
        
        mountsJsonArray.push({
          name: mount.name,
          speed: mount.speed,
          image: `/uploads/system/mounts/${filename}`
        });
        
        count++;
        // Pequena pausa entre downloads para não sobrecarregar
        await new Promise(res => setTimeout(res, 200));
      } else {
        console.warn(`Extensão não reconhecida para arquivo de imagem: ${filename}`);
      }
    }
    
    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(mountsJsonArray, null, 2), 'utf-8');

    console.log(`\nFinalizado! ${count} imagens foram salvas em ${OUTPUT_DIR}`);
    console.log(`JSON gerado em ${JSON_OUTPUT_PATH}`);
  } catch (error) {
    console.error('Erro na execução:', error);
  } finally {
    await browser.close();
  }
}

main();
