class Config {
    url: string = '';

    public setUrl (url:string) {
        if (url.startsWith('https')) {
            this.url = url.replace('https', 'wss');
        } else if (url.startsWith('http')) {
            this.url = url.replace('http', 'ws');
        } else {
            this.url = url;
        }
    }
}

export = new Config();
