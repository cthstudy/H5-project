var enjoyhint_instance = new EnjoyHint({});

var enjoyhint_script_steps = [
  {
  	'next .navbar-brand' : '欢迎来到我的搜索！让我来引导你了解它的特点。',
	'skipButton' : {className: "mySkip", text: "不了!"},
  	'nextButton' : {className: "myNext", text: "可以"}
  	
  },
  {
  	'key #mySearchButton' : "请输入关键词搜索，并按“Enter”进去下一步",
  	'keyCode' : 13
  },
  {
  	'click .btn' : '点击这个按钮，切换下拉菜单，进入下一步'
  },
  {
  	'next .about' : '检查可用的所有功能的列表',
  	'shape': 'circle'
  },
  {
  	'next .contact' : '您的反馈将不胜感激。',
  	'shape': 'circle',
  	'radius': 70,
  	'showSkip' : false,
  	'nextButton' : {className: "myNext", text: "知道了!"}
  }

];

enjoyhint_instance.set(enjoyhint_script_steps);
enjoyhint_instance.run();