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

        const a = 2;
        switch (a)
        {
            // Для пустых операторов case разрешено "проваливание" от одного оператора к другому.
            case '1':
            case "2": console.log("Этот день недели - Рабочий.");
            case "3":
            case "4":
            case "5":
                console.log("Этот день недели - Рабочий.");
                break;
            case "6":
            case "7":
                console.log("Этот день недели - Выходной.");
                break;
            default:
                console.log("Вы ввели несуществующий день недели.");
                break;
        }
    }
}

export = new Config();
