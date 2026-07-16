export const apps = [
  {
    name: 'thygas[api]',
    script: 'npm run start:prod',
    watch: false,
    autorestart: true,
    node_args: ['--max-old-space-size=512'],
    interpreter_args: '--harmony',
    max_memory_restart: '800M',
  },
];
