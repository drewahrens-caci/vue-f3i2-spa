var moment = require('moment')
module.exports = () => {
  ;(function() {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

    Math.uuid = function(len, radix) {
      var chars = CHARS,
        uuid = [],
        i
      radix = radix || chars.length

      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
      } else {
        var r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16)
            uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
          }
        }
      }
      return uuid.join('')
    }

    Math.uuidFast = function() {
      var chars = CHARS,
        uuid = new Array(36),
        rnd = 0,
        r
      for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
          uuid[i] = '-'
        } else if (i == 14) {
          uuid[i] = '4'
        } else {
          if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0
          r = rnd & 0xf
          rnd = rnd >> 4
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
      return uuid.join('')
    }

    Math.uuidCompact = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  })()

  const data = { projects: [], milestones: [], rebaselines: [], causecats: [], causes: [] }
  var users = ['Mickey Mouse', 'Donald Duck', 'Goofy', 'Daffy Duck', 'Porky Pig', 'Yosimite Sam', 'Mighty Mouse', 'Woody Woodpecker', 'Sylvester', 'Bugs Bunny']
  var orgs = ['MA', 'MB', 'MC', 'QA', 'QB', 'QC']
  var years = ['2014', '2015', '2016', '2017', '2018', '2019']
  var causecats = ['Cat A', 'Cat B', 'Cat C', 'Cat D', 'Cat E', 'Cat F', 'Cat G']
  var causes = ['Cause 1', 'Cause 2', 'Cause 3', 'Cause 4', 'Cause 5', 'Cause 6', 'Cause 7']

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  data.causecats = causecats
  for (let i = 0; i < causecats.length; i++) {
    for (let o = 0; o < causes.length; o++) {
      data.causes.push({
        Title: causes[o],
        Category: causecats[i]
      })
    }
  }

  for (let i = 0; i < years.length; i++) {
    for (let j = 0; j < 12; j++) {
      // for this year create a random number of projects for each month. We will randomize the number from 2 to 6.
      var month = j + 1
      if (month <= 9) {
        month = String('0' + month)
      }
      let pcount = getRandomInt(4) + 2 // adding 2 ensures we get at least 2
      for (let k = 0; k < pcount; k++) {
        let org = String(orgs[getRandomInt(6)])
        let dept = org.substr(0, 1)
        let manager = getRandomInt(10)
        let day = getRandomInt(23) + 5 // get a random day in any month
        let erpdr = 'DR-' + years[i] + '.0' + k * getRandomInt(500)
        data.rebaselines.push({
          ProjectTitle: 'Project Title',
          ERPDR: erpdr,
          // PjM_x0020_Code_x003a_Dept: dept,
          // PjM_x0020_Code_x003a_Div: org,
          Dept: dept,
          Div: org,
          ProjectManager: users[manager],
          month: month,
          FY: years[i],
          RebaselineDate: moment()
            .year(years[i])
            .month(j)
            .date(day),
          RootCauseCat: 'CAT ' + getRandomInt(10),
          RootCause: 'CAUSE ' + getRandomInt(5)
        })
      }
    }
  }

  for (let i = 0; i < years.length; i++) {
    for (let j = 0; j < 12; j++) {
      // for this year create a random number of projects for each month. We will randomize the number from 2 to 6.
      month = j + 1
      if (month <= 9) {
        month = String('0' + month)
      }
      let pcount = getRandomInt(4) + 2 // adding 2 ensures we get at least 2
      for (let k = 0; k < pcount; k++) {
        let org = String(orgs[getRandomInt(6)])
        let dept = org.substr(0, 1)
        let c = getRandomInt(pcount) // get a random number of the projects and these will be completed
        let d = pcount - c
        let manager = getRandomInt(10)
        let Sponsor = getRandomInt(10)
        let day = getRandomInt(23) + 5 // get a random day in any month
        // we are going to count as we go and just set the completed ones first and then the completed on time
        let erpid = 'DR-' + years[i] + '.0' + k * getRandomInt(500)
        let level = null
        for (let l = 0; l < c; l++) {
          // completed
          let ot = getRandomInt(2)
          level = getRandomInt(10)
          data.projects.push({
            id: Math.uuid(),
            title: 'Project Title',
            erpid: erpid,
            dept: dept,
            div: org,
            pjm: org,
            level: level,
            manager: users[manager],
            Sponsor: users[Sponsor],
            md: 'Y',
            month: month,
            FY: years[i],
            pstart: moment()
              .year(years[i])
              .month(j)
              .date(1),
            pfinish: moment()
              .year(years[i])
              .month(j)
              .date(day),
            astart: moment()
              .year(years[i])
              .month(j)
              .date(5),
            afinish:
              ot === 1
                ? moment()
                    .year(years[i])
                    .month(j)
                    .date(day - 1)
                : moment()
                    .year(years[i])
                    .month(j)
                    .date(day + 2),
            complete: true
          })
          // add random completed milestones
          for (let n = 0; n < pcount; n++) {
            let mot = getRandomInt(2)
            let cd = getRandomInt(3)
            data.milestones.push({
              erpid: erpid,
              ptitle: 'Project Title',
              dept: dept,
              div: org,
              pjm: org,
              level: level,
              cd: cd > 1 ? 'Y' : 'N',
              manager: users[manager],
              title: 'Milestone - ' + n * getRandomInt(500),
              FY: years[i],
              month: j,
              mdps: moment()
                .year(years[i])
                .month(j)
                .date(n + 1),
              mdpf: moment()
                .year(years[i])
                .month(j)
                .date(n + 20),
              mdas: moment()
                .year(years[i])
                .month(j)
                .date(n + 1),
              mdaf:
                mot === 1
                  ? moment()
                      .year(years[i])
                      .month(j)
                      .date(n + 18)
                  : moment()
                      .year(years[i])
                      .month(j)
                      .date(n + 22)
            })
          }
        }
        for (let m = 0; m < d; m++) {
          // not completed
          data.projects.push({
            id: Math.uuid(),
            title: 'Project Title',
            erpid: erpid,
            dept: dept,
            div: org,
            pjm: org,
            manager: users[manager],
            Sponsor: users[Sponsor],
            md: 'Y',
            FY: years[i],
            month: month,
            pstart: moment()
              .year(years[i])
              .month(j)
              .date(1),
            pfinish: moment()
              .year(years[i])
              .month(j)
              .date(day),
            astart: '',
            afinish: '',
            complete: false
          })
          for (let n = 0; n < pcount; n++) {
            let cd = getRandomInt(3)
            data.milestones.push({
              erpid: erpid,
              ptitle: 'Project Title',
              dept: dept,
              div: org,
              pjm: org,
              level: level,
              cd: cd > 1 ? 'Y' : 'N',
              manager: users[manager],
              title: 'Milestone - ' + n * getRandomInt(500),
              FY: years[i],
              month: j,
              mdps: moment()
                .year(years[i])
                .month(j)
                .date(n + 1),
              mdpf: moment()
                .year(years[i])
                .month(j)
                .date(n + 20),
              mdas: moment()
                .year(years[i])
                .month(j)
                .date(n + 1),
              mdaf: ''
            })
          }
        }
      }
    }
  }
  return data
}
