DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `redirect` varchar(255) NOT NULL,
  `meta` varchar(255) NOT NULL,
  `pid` int(11) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_51b63874cdce0d6898a0b2150f` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menu
-- ----------------------------
BEGIN;
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (1, '/about', 'About', '/about/index', '{\"hideChildrenInMenu\":true,\"icon\":\"simple-icons:about-dot-me\",\"title\":\"routes.dashboard.about\",\"orderNo\":100000}', 0, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (2, 'index', 'AboutPage', '', '{\"title\":\"routes.dashboard.about\",\"icon\":\"simple-icons:about-dot-me\",\"hideMenu\":true}', 1, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (3, '/dashboard', 'Dashboard', '/dashboard/analysis', '{\"orderNo\":10,\"icon\":\"ion:grid-outline\",\"title\":\"routes.dashboard.dashboard\"}', 0, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (4, 'analysis', 'Analysis', '', '{\"title\":\"routes.dashboard.analysis\"}', 3, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (5, 'workbench', 'Workbench', '', '{\"title\":\"routes.dashboard.workbench\"}', 3, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (6, '/permission', 'Permission', '/permission/menu', '{\"orderNo\":15,\"icon\":\"ion:key-outline\",\"title\":\"routes.demo.permission.permission\"}', 0, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (7, 'menu', 'PermissionMenu', '', '{\"title\":\"routes.demo.permission.menu\",\"roles\": \"[\\\"super\\\"]\"}', 6, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (8, '/charts', 'Charts', '/charts/echarts/map', '{\"orderNo\":500,\"icon\":\"ion:bar-chart-outline\",\"title\":\"routes.demo.charts.charts\"}', 0, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (10, 'baiduMap', 'BaiduMap', '', '{\"title\":\"routes.demo.charts.baiduMap\"}', 8, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (15, 'echarts', 'Echarts', '/charts/echarts/map', '{\"title\":\"Echarts\"}', 8, 1);
INSERT INTO `menu` (`id`, `path`, `name`, `redirect`, `meta`, `pid`, `active`) VALUES (16, 'map', 'Map', '', '{\"title\":\"routes.demo.charts.map\"}', 15, 1);
COMMIT;


