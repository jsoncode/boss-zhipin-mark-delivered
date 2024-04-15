// ==UserScript==
// @name         boss直聘已投递企业标记
// @namespace    http://tampermonkey.net/
// @version      2024-04-15
// @description  try to take over the world!
// @author       You
// @match        https://www.zhipin.com/job_detail/*
// @match        https://www.zhipin.com/web/geek/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// ==/UserScript==

(async function() {
	'use strict';

	const btn = document.querySelector('.btn-startchat')
	let name = document.querySelector('.boss-info-attr')
	let list = await getList()
	console.log(list)
	if(btn){
		if(name){
			name = name.innerText
			name = name.split(/[\s·]/)?.[0]

			let hasChat = btn.innerText.trim()==='继续沟通' || list.find(i=>i===name)
			if(hasChat){
				list.push(name)
				let newBtn = document.createElement('a')
				newBtn.className='btn'
				newBtn.style= 'background:#f00;color:#fff;width:180px;'
				newBtn.innerText ='该公司已经沟通过'

				btn.parentElement.appendChild(newBtn)
			}
			btn.addEventListener('click',()=>{
				list.push(name)
			})

		}
	}

	if(location.href.startsWith('https://www.zhipin.com/web/geek')){
		run();
		const timer = setInterval(()=>{
			setInterval(timer)
			run();
		},5000)
	}
	function run(){
		let domList = document.querySelectorAll('.job-card-footer .boss-name')
		domList = Array.from(domList)
		domList.forEach(dom=>{
			const value = dom.innerText.trim();
			const has = list.find(i=>i===value);
			if(has){
				dom.style.color='red'
				let span = dom.parentElement.querySelector('.yitoudi')
				if(!span){
					span = document.createElement('span')
					span.className="yitoudi"
					span.style.color='red'
					span.style.marginLeft='10px'
					span.innerText ='(已投递)'
					dom.parentElement.appendChild(span)
				}
			}
		})
	}

	async function getList(){
		let res= await fetch('https://www.zhipin.com/wapi/zprelation/friend/geekFilterByLabel?labelId=0').then(res=>res.json())
		return res.zpData.friendList.map(i=>i.brandName)
	}
})();
