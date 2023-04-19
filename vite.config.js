import { resolve } from 'path'
import { defineConfig } from 'vite'


const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')


// https://vitejs.dev/config/
export default defineConfig({
  root,
  base: '/NewTigerStore/',
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      assetFileNames: ({name}) => {
        return 'assets/[name]-[hash][extname]';
      },
      input: {
        index: resolve(root,  'index.html'),
        addRestaurant: resolve(root,  'ReviewOrder' ,'index.html'),
        findRestaurant: resolve(root,  'SignIn' ,'index.html'),
        friendLink: resolve(root,  'Teacher' ,'index.html'),
       
      }
    }
  }
})
