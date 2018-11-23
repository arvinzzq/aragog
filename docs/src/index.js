import fs from 'fs';
import path from 'path';
import Aragog from '../../lib/aragog';
const aragog = new Aragog({
  username: 'zz1211',
  repository: 'Doraemon',
  selector: `div[id^=issue_] a[href*="/zz1211/Doraemon/issues/"][id^=issue-id-]`
});

(async () => {
  await aragog.openPage();
  let issueList = [];
  let list = []
  let page = 1;
  do {
    list = await aragog.fetchIssueList({
      queryConditions: {
        'utf8': true,
        page: page++,
        q: ['is:issue', 'is:open', 'label:blog', '-label:TBD ']
      }
    });
    issueList = issueList.concat(list)
  } while (list.length > 0)
  console.log('issueList ===> ', issueList);
  fs.writeFileSync(path.resolve(process.cwd(), './issues.json'), JSON.stringify(issueList, null, 2), 'utf8');
  await aragog.closeBrowser();
})();