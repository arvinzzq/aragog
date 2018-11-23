import puppeteer from 'puppeteer';

export default class Aragog {
  constructor(config = {}) {
    this.config = config;
  }

  generateUrl(baseUrl, queryConditions) {
    const queryParams = Object.keys(queryConditions).map(query => {
      if (query === 'q' && !(queryConditions[query] instanceof Array)) {
        throw new Error('q must be array');
      }
      return `${query}=${query === 'q' ?
      queryConditions[query].map(item => encodeURIComponent(item)).join('+') : queryConditions[query]}`;
    }).join('&');
    return `${baseUrl}?${queryParams}`;
  }

  async openPage() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...this.config
    });
    process.on("unhandledRejection", (reason, p) => {
      console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
      this.browser.close();
      process.exit(1);
    });

    this.page = await this.browser.newPage();
    this.page.on('console', consoleObj => console.log(consoleObj._text));
    console.info('open new page ->');
  }

  async fetchIssueList(options) {
    const { username = '', repository = '', queryConditions = {}, selector } = {...this.config, ...options};
    const url = this.generateUrl(`https://github.com/${username}/${repository}/issues`, queryConditions);
    console.info(`Fetch issue list ->\nurl: ${url}`);
    await this.page.goto(url, {waitUntil: 'networkidle2'});
    const issueList = await this.page.evaluate(args => {
      const { username, repository, selector } = args;
      const domList = document.querySelectorAll(selector || `li[id^=issue_] a[href*="/${username}/${repository}/issues/"]`);
      const len = domList.length;
      const list = [];
      for (let i = 0; i < len; i++) {
        const nextElement = domList[i].nextElementSibling;
        const labels = [];
        if (nextElement && nextElement.classList.contains('labels')) {
          const labelDomList = nextElement ? nextElement.children : [];
          const nums = labelDomList.length;
          for (let j = 0; j < nums; j++) {
            labels.push(labelDomList[j].innerText.trim());
          }
        }
        list.push({
          title: domList[i].innerText.trim(),
          href: domList[i].href.trim(),
          labels
        });
      }
      return list;
    }, { username, repository, selector });
    console.info('Issue list fetched ->');
    return issueList;
  }

  async closeBrowser() {
    console.info('Close browser ->');
    this.browser.close();
  }
};