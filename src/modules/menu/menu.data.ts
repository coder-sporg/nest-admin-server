export const MENU_LIST = `[
    {
        "path":"/about",
        "name":"About",
        "redirect":"/about/index",
        "meta":{
            "hideChildrenInMenu":true,
            "icon":"simple-icons:about-dot-me",
            "title":"routes.dashboard.about",
            "orderNo":100000
        },
        "children":[
            {
                "path":"index",
                "name":"AboutPage",
                "meta":{
                    "title":"routes.dashboard.about",
                    "icon":"simple-icons:about-dot-me",
                    "hideMenu":true
                }
            }
        ]
    },
      {
      "path":"/dashboard",
      "name":"Dashboard",
      "redirect":"/dashboard/analysis",
      "meta":{
        "orderNo":10,
        "icon":"ion:grid-outline",
        "title":"routes.dashboard.dashboard"
      },
      "children":[
        {
          "path":"analysis",
          "name":"Analysis",
          "meta":{"title":"routes.dashboard.analysis"}
        },
        {
          "path":"workbench",
          "name":"Workbench",
          "meta":{"title":"routes.dashboard.workbench","roles": "[\\"super\\"]"}
        }
      ]
    },
    {
      "path":"/charts",
      "name":"Charts",
      "redirect":"/charts/echarts/map",
      "meta":{"orderNo":500,"icon":"ion:bar-chart-outline","title":"routes.demo.charts.charts"},
      "children":[
          {
              "path":"baiduMap",
              "name":"BaiduMap",
              "meta":{"title":"routes.demo.charts.baiduMap"}
          },
          {
              "path":"aMap",
              "name":"AMap",
              "meta":{
                  "title":"routes.demo.charts.aMap"
              }
          },
          {
              "path":"googleMap",
              "name":"GoogleMap",
              "meta":{
                  "title":"routes.demo.charts.googleMap"
              }
          },
          {
              "path":"echarts",
              "name":"Echarts",
              "meta":{"title":"Echarts"},
              "redirect":"/charts/echarts/map",
              "children":[
                  {
                      "path":"map",
                      "name":"Map",
                      "meta":{"title":"routes.demo.charts.map"}
                  },
                  {
                      "path":"line",
                      "name":"Line",
                      "meta":{
                          "title":"routes.demo.charts.line"
                      }
                  },
                  {
                      "path":"pie",
                      "name":"Pie",
                      "meta":{
                          "title":"routes.demo.charts.pie"
                      }
                  }
              ]
          }
      ]
  },
  {
      "path":"/page-demo",
      "name":"PageDemo",
      "redirect":"/page-demo/form/basic",
      "meta":{
          "orderNo":20,
          "icon":"ion:aperture-outline",
          "title":"routes.demo.page.page"
      },
      "children":[
          {
              "path":"form",
              "name":"FormPage",
              "redirect":"/page-demo/form/basic",
              "meta":{
                  "title":"routes.demo.page.form"
              },
              "children":[
                  {
                      "path":"basic",
                      "name":"FormBasicPage",
                      "meta":{
                          "title":"routes.demo.page.formBasic"
                      }
                  },
                  {
                      "path":"step",
                      "name":"FormStepPage",
                      "meta":{
                          "title":"routes.demo.page.formStep"
                      }
                  },
                  {
                      "path":"high",
                      "name":"FormHightPage",
                      "meta":{
                          "title":"routes.demo.page.formHigh"
                      }
                  }
              ]
          },
          {
              "path":"desc",
              "name":"DescPage",
              "redirect":"/page-demo/desc/basic",
              "meta":{
                  "title":"routes.demo.page.desc"
              },
              "children":[
                  {
                      "path":"basic",
                      "name":"DescBasicPage",
                      "meta":{
                          "title":"routes.demo.page.descBasic"
                      }
                  },
                  {
                      "path":"high",
                      "name":"DescHighPage",
                      "meta":{
                          "title":"routes.demo.page.descHigh"
                      }
                  }
              ]
          },
          {
              "path":"result",
              "name":"ResultPage",
              "redirect":"/page-demo/result/success",
              "meta":{
                  "title":"routes.demo.page.result"
              },
              "children":[
                  {
                      "path":"success",
                      "name":"ResultSuccessPage",
                      "meta":{
                          "title":"routes.demo.page.resultSuccess"
                      }
                  },
                  {
                      "path":"fail",
                      "name":"ResultFailPage",
                      "meta":{
                          "title":"routes.demo.page.resultFail"
                      }
                  }
              ]
          },
          {
              "path":"account",
              "name":"AccountPage",
              "redirect":"/page-demo/account/setting",
              "meta":{
                  "title":"routes.demo.page.account"
              },
              "children":[
                  {
                      "path":"center",
                      "name":"AccountCenterPage",
                      "meta":{
                          "title":"routes.demo.page.accountCenter"
                      }
                  },
                  {
                      "path":"setting",
                      "name":"AccountSettingPage",
                      "meta":{
                          "title":"routes.demo.page.accountSetting"
                      }
                  }
              ]
          },
          {
              "path":"exception",
              "name":"ExceptionPage",
              "redirect":"/page-demo/exception/404",
              "meta":{
                  "title":"routes.demo.page.exception"
              },
              "children":[
                  {
                      "path":"403",
                      "name":"PageNotAccess",
                      "props":{
                          "status":403
                      },
                      "meta":{
                          "title":"403"
                      }
                  },
                  {
                      "path":"404",
                      "name":"PageNotFound",
                      "props":{
                          "status":404
                      },
                      "meta":{
                          "title":"404"
                      }
                  },
                  {
                      "path":"500",
                      "name":"ServiceError",
                      "props":{
                          "status":500
                      },
                      "meta":{
                          "title":"500"
                      }
                  },
                  {
                      "path":"net-work-error",
                      "name":"NetWorkError",
                      "props":{
                          "status":10000
                      },
                      "meta":{
                          "title":"routes.demo.page.netWorkError"
                      }
                  },
                  {
                      "path":"not-data",
                      "name":"NotData",
                      "props":{
                          "status":10100
                      },
                      "meta":{
                          "title":"routes.demo.page.notData"
                      }
                  }
              ]
          },
          {
              "path":"list",
              "name":"ListPage",
              "redirect":"/page-demo/list/card",
              "meta":{
                  "title":"routes.demo.page.list"
              },
              "children":[
                  {
                      "path":"basic",
                      "name":"ListBasicPage",
                      "meta":{
                          "title":"routes.demo.page.listBasic"
                      }
                  },
                  {
                      "path":"card",
                      "name":"ListCardPage",
                      "meta":{
                          "title":"routes.demo.page.listCard"
                      }
                  },
                  {
                      "path":"search",
                      "name":"ListSearchPage",
                      "meta":{
                          "title":"routes.demo.page.listSearch"
                      }
                  }
              ]
          }
      ]
  },
  {
    "path": "/permission",
    "name": "Permission",
    "redirect": "/permission/front/page",
    "meta": {
      "orderNo": 15,
      "icon": "ion:key-outline",
      "title": "routes.demo.permission.permission"
    },
    "children": [
      {
        "path": "front",
        "name": "PermissionFrontDemo",
        "meta": { "title": "routes.demo.permission.front" },
        "children": [
          {
            "path": "page",
            "name": "FrontPageAuth",
            "meta": { "title": "routes.demo.permission.frontPage" }
          },
          {
            "path": "btn",
            "name": "FrontBtnAuth",
            "meta": { "title": "routes.demo.permission.frontBtn" }
          },
          {
            "path": "auth-pageA",
            "name": "FrontAuthPageA",
            "meta": { "title": "routes.demo.permission.frontTestA", "roles": ["super"] }
          },
          {
            "path": "auth-pageB",
            "name": "FrontAuthPageB",
            "meta": { "title": "routes.demo.permission.frontTestB", "roles": ["test"] }
          }
        ]
      },
      {
        "path": "back",
        "name": "PermissionBackDemo",
        "meta": { "title": "routes.demo.permission.back" },
        "children": [
          {
            "path": "page",
            "name": "BackAuthPage",
            "meta": { "title": "routes.demo.permission.backPage" }
          },
          {
            "path": "btn",
            "name": "BackAuthBtn",
            "meta": { "title": "routes.demo.permission.backBtn" }
          }
        ]
      }
    ]
  }
  ]`;
