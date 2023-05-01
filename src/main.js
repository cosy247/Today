import { createSSRApp } from 'vue';
import App from './App.vue';
import './css/font.css';
import './css/theme.css';

export function createApp() {
    const app = createSSRApp(App);
    return {
        app,
    };
}
