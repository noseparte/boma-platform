<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<%@ include file = "../inc/version.jsp" %>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>数据可视化</title>
		<link href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css" rel="stylesheet" type="text/css"/>
		<link href="<%=basePath%>css/common_${ CSS_COMMON_VERSION }.css" rel="stylesheet" type="text/css"/>
		<style type="text/css">
			.pie-container {
				height: 400px;
			}
		</style>
		<script type="text/javascript">
			var path = '<%=path %>';
			var basePath = '<%=basePath%>';
			(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
		</script>
	</head>
	<body>
		<header class="ui-page-header">
			<div class="mini-title">学科统计分析</div>
		</header>
		<div class="panel panel-default">
			<div class="panel-heading form-inline">
				<div class="form-group">
					<label>日期</label>
					<input id="statistic-date" type="text" data-date-format="yyyy-mm-dd" class="form-control form-date">
				</div>
			</div>
			<div id="subject-statistic-container" class="panel-body pie-container"></div>
			<div id="location-column-container" class="panel-body pie-container"></div>
		</div>
		<script type="text/javascript">
			MX.load({
				js: 'lib/sea',
				version: '${ JS_LIB_SEA_VERSION }',
				success: function() {
					seajs.use(['lib/jquery', 'lib/highcharts', 'lib/drilldown', 'lib/map', 'util/data', 'util/ajaxPromise', 'util/bootstrap.datetimepicker.zh-CN', 'data/china'], function($, highcharts, drilldown, map, data, ajaxPromise, datetimepicker, china) {
						var renderSubject, _date, chart, setChart, colors, provinces;
						_date = $('#statistic-date');
						_date.datetimepicker({
							language: 'zh-CN',/*加载日历语言包，可自定义*/
							weekStart: 1,
							todayBtn: 1,
							autoclose: 1,
							todayHighlight: 1,
							minView: 2,
							forceParse: 0,
							showMeridian: 1
						}).on('changeDate', function(e) {
							renderSubject(_date.val());
						});
						renderSubject = function(date) {
							var data = {};
							if(date !== undefined) {
								data.date = date;
							}
							ajaxPromise({
								url: window.basePath + 'confidential/querylogSubjectSearch',
								type: 'GET',
								data: data,
								dataType: 'json'
							}).then(function(data) {
								var result = data.result, _locationData = result.querylogLocationCount, locationData = {}, columnData;
								if(date === undefined) {
									_date.val(result.date);
								} else if(_date.val() !== result.date) {
									alert(_date.val() + '暂无数据');
									_date.val(result.date);
								}
								$('#subject-statistic-container').highcharts({
									title: {
										text: '搜索中各学科的分布 (' + result.date + ')'
									},
									tooltip: {
										pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
									},
									plotOptions: {
										pie: {
											allowPointSelect: true,
											cursor: 'pointer',
											dataLabels: {
												enabled: true,
												color: '#000',
												connectorColor: '#000',
												format: '<b>{point.name}</b>: {point.percentage:.1f} %'
											}
										}
									},
									series: [{
										type: 'pie',
										name: 'subject proportion',
										data: result.data
									}]
								});
								/** 省份downdrill
								locationData.provincesData = _locationData.provincesData;
								locationData.citiesData = _locationData.citiesData.map(function(o) {
									var cityData = [];
									o.cityName.forEach(function(name, i) {
										cityData.push([name, o.cityCount[i]]);
									});
									return {
										id: o.id,
										name: o.name,
										data: cityData
									};
								});
								$('#location-statistic-container').highcharts({
									chart: {
										type: 'pie'
									},
									title: {
										text: '每日拍题地区分布'
									},
									tooltip: {
										headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
										pointFormat: '<span style="color:{point.color}">{point.name}</span>:<b>{point.y:.2f}%</b> of total'
									},
									plotOptions: {
										series: {
											dataLabels: {
												enabled: true,
												format: '{point.name}:{point.y:.1f}%'
											}
										}
									},
									series: [{
										name: '每日拍题地区分布',
										colorByPoint: true, //?
										data: locationData.provincesData
									}],
									drilldown: {
										series: locationData.citiesData
									}
								});*/
								// 省份map
								// locationData = [{
								// 	'hc-key': 'cn-jl',
								// 	'value': 14280
								// }, {
								// 	'hc-key': 'cn-tj',
								// 	'value': 15280
								// }, {
								// 	'hc-key': 'cn-ah',
								// 	'value': 13720
								// }, {
								// 	'hc-key': 'cn-sd',
								// 	'value': 25520
								// }, {
								// 	'hc-key': 'cn-sx',
								// 	'value': 8760
								// }, {
								// 	'hc-key': 'cn-xj',
								// 	'value': 11160
								// }, {
								// 	'hc-key': 'cn-hb',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-he',
								// 	'value': 16520
								// }, {
								// 	'hc-key': 'cn-hn',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-gs',
								// 	'value': 7440
								// }, {
								// 	'hc-key': 'cn-fj',
								// 	'value': 11080
								// }, {
								// 	'hc-key': 'cn-gz',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-cq',
								// 	'value': 29040
								// }, {
								// 	'hc-key': 'cn-js',
								// 	'value': 45880
								// }, {
								// 	'hc-key': 'cn-hu',
								// 	'value': 29040
								// }, {
								// 	'hc-key': 'cn-nm',
								// 	'value': 7880
								// }, {
								// 	'hc-key': 'cn-gx',
								// 	'value': 4600
								// }, {
								// 	'hc-key': 'cn-hl',
								// 	'value': 12880
								// }, {
								// 	'hc-key': 'cn-yn',
								// 	'value': 6320
								// }, {
								// 	'hc-key': 'cn-ln',
								// 	'value': 14160
								// }, {
								// 	'hc-key': 'cn-6668',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-zj',
								// 	'value': 13600
								// }, {
								// 	'hc-key': 'cn-sh',
								// 	'value': 18400
								// }, {
								// 	'hc-key': 'cn-bj',
								// 	'value': 109680
								// }, {
								// 	'hc-key': 'cn-gd',
								// 	'value': 29040
								// }, {
								// 	'hc-key': 'cn-3681',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-xz',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-sa',
								// 	'value': 14760
								// }, {
								// 	'hc-key': 'cn-sc',
								// 	'value': 28160
								// }, {
								// 	'hc-key': 'cn-ha',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-nx',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-qh',
								// 	'value': 3320
								// }, {
								// 	'hc-key': 'cn-jx',
								// 	'value': 0
								// }, {
								// 	'hc-key': 'cn-tw',
								// 	'value': 0
								// }];
								// $('#location-statistic-container').highcharts('Map', {
								// 	title: {
								// 		text: '每日拍题地区分布'
								// 	},
								// 	mapNavigation: {
								// 		enabled: true,
								// 		buttonOptions: {
								// 			verticalAlign: 'bottom'
								// 		}
								// 	},
								// 	colorAxis: {
								// 		min: 0
								// 	},
								// 	series: [{
								// 		data: locationData,
								// 		mapData: Highcharts.maps['countries/china'],
								// 		joinBy: 'hc-key',
								// 		name: '每日拍题分布',
								// 		states: {
								// 			hover: {
								// 				color: '#bada55'
								// 			}
								// 		},
								// 		dataLabels: {
								// 			enabled: true,
								// 			format: '{point.name}'
								// 		}
								// 	}]
								// });
								// column drilldown
								/**
								 * querylogLocationCount
								 * 	citiesData
								 * 		cityCount
								 * 		cityName
								 * 		cityPercent 0.0461
								 * 		id
								 * 		name
								 *  provincesData
								 *  	count
								 *  	drilldown
								 *  	name
								 *  	y
								 */
								colors = Highcharts.getOptions().colors;
								_locationData.provincesData.forEach(function(o, i) {
									o.drilldown.color = o.color = colors[i % 10];
								});
								columnData = _locationData.provincesData;
								provinces = columnData.map(function(o) {
									return o.drilldown.name;
								});
								setChart = function(name, categories, data, color) {
									chart.xAxis[0].setCategories(categories, false);
									chart.series[0].remove(false);
									chart.addSeries({
										name: name,
										data: data,
										color: color || 'white'
									}, false);
									chart.redraw();
								};
								chart = $('#location-column-container').highcharts({
									chart: {
										type: 'column'
									},
									title: {
										text: '每日拍题地区分布'
									},
									xAxis: {
										categories: provinces
									},
									yAxis: {
										title: {
											text: '地区分布比例'
										}
									},
									plotOptions: {
										column: {
											cursor: 'pointer',
											point: {
												events: {
													click: function() {
														var drilldown = this.drilldown;
														if(drilldown && drilldown.categories.length) {
															setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
														} else {
															setChart('地区分布', provinces, columnData);
														}
													}
												}
											},
											dataLabels: {
												enabled: true,
												// color: colors[0],
												style: {
													fontWeight: 'bold'
												},
												formatter: function() {
													return this.y + '%';
												}
											}
										}
									},
									tooltip: {
										formatter: function() {
											var point = this.point,
												s = this.x + ':<b>' + this.y + '%</b><br />';
											if(point.drilldown) {
												s += '点击查看' + point.category + '城市分布';
											} else {
												s += '点击返回省份分布';
											}
											return s;
										}
									},
									series: [{
										name: '地区分布',
										data: columnData,
										color: 'white'
									}],
									exporting: {
										enabled: false
									}
								}).highcharts();
							});
						};
						renderSubject();
					});
				}
			});
		</script>
	</body>
</html>