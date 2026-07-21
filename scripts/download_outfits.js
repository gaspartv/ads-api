const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Adiciona o plugin stealth para tentar contornar a proteção do Cloudflare
puppeteer.use(StealthPlugin());

const OUTPUT_DIR = path.join(process.cwd(), 'uploads', 'system', 'outfits');
const TARGET_URL = 'https://www.tibiawiki.com.br/wiki/Outfits';

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
    // Usamos o próprio navegador para baixar a imagem via buffer, garantindo que cookies/sessão sejam passados.
    const imageBuffer = await page.evaluate(async (imgUrl) => {
      const response = await fetch(imgUrl);
      const arrayBuffer = await response.arrayBuffer();
      // Converte para um array de bytes para retornar ao Node
      return Array.from(new Uint8Array(arrayBuffer));
    }, url);

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

  console.log('Iniciando o Puppeteer para passar pelo Cloudflare...');
  const browser = await puppeteer.launch({ 
    headless: true, // Use false se quiser ver o navegador abrindo
    args: ['--no-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    console.log(`Acessando ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Aguarda um tempo extra caso o Cloudflare esteja processando ("Just a moment...")
    console.log('Aguardando possível verificação do Cloudflare...');
    await new Promise(res => setTimeout(res, 5000));

    // Pega todas as imagens da página
    const imageUrls = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      const urls = new Set();
      imgs.forEach(img => {
        if (img.src) urls.add(img.src);
      });
      return Array.from(urls);
    });

    console.log(`Foram encontradas ${imageUrls.length} imagens na página.`);

    let count = 0;
    for (let url of imageUrls) {
      // Pega a URL original caso seja thumbnail
      url = getOriginalImageUrl(url);
      
      const decodedUrl = decodeURIComponent(url);
      const filename = path.basename(decodedUrl.split('?')[0]); // Remove query params se houver
      
      if (filename.match(/\.(png|gif|jpe?g|webp)$/i)) {
        await downloadImageWithPage(page, url, filename);
        count++;
        // Pequena pausa entre downloads
        await new Promise(res => setTimeout(res, 200));
      }
    }
    
    console.log(`\nFinalizado! ${count} imagens foram salvas em ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Erro na execução:', error);
  } finally {
    await browser.close();
  }
}

main();
