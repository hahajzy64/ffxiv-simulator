﻿const sim = require('./sim.js');
const set = require('./setting.js');
const fs = require('fs');

var log = [], dps = [], sum = 0, totalDamage = 0;
var input = set.set();

//var times = 0;
var dmgT = 0;
var crit = 0;
var dh = 0;

if (input.simulate.battleLog) {
    // 生成 Battle Log.json
    var data = sim.run(input);
    for (var i = 0; i < data.log.length; i++) {
        if (data.log[i].event == 'Damage') {
            var m = '';
            if (data.log[i].dh) {
                m += '(直)';
                dh += 1;
            }
            if (data.log[i].crit) {
                m += '(暴)';
                crit += 1;
            }
            dmgT += 1;
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] ' + data.log[i].translate + '造成了' + data.log[i].damage + m + '点伤害.');
        } else if (data.log[i].event == 'DOT Tick') {
            var m = '';
            if (data.log[i].dh) {
                m += '(直)';
                dh += 1;
            }
            if (data.log[i].crit) {
                m += '(暴)';
                crit += 1;
            }
            dmgT += 1;
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] ' + data.log[i].translate + '造成了' + data.log[i].damage + m + '点DOT伤害.');
        } else if (data.log[i].event == 'Circle Tick') {
            var m = '';
            if (data.log[i].dh) {
                m += '(直)';
                dh += 1;
            }
            if (data.log[i].crit) {
                m += '(暴)';
                crit += 1;
            }
            dmgT += 1;
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] ' + data.log[i].translate + '造成了' + data.log[i].damage + m + '点地板伤害.');
        } else if (data.log[i].event == 'Cast') {
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] 开始使用' + data.log[i].translate + '.');
        } else if (data.log[i].event == 'Buff Apply') {
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] 获得了' + data.log[i].translate + '效果.');
        } else if (data.log[i].event == 'Party Buff Apply') {
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] 获得了来自队伍的' + data.log[i].translate + '效果.');
        } else if (data.log[i].event == 'DOT Apply') {
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] 目标获得了' + data.log[i].translate + '效果.');
        } else if (data.log[i].event == 'Circle Apply') {
            console.log('[' + (data.log[i].time / 100).toFixed(2) + '] 施加了' + data.log[i].translate + '地板效果.');
        }
    }
    console.log('DPS: ' + data.dps);
    console.log('暴击率: ' + Math.floor(10000 * crit / dmgT) / 100 + '%.');
    console.log('直击率: ' + Math.floor(10000 * dh / dmgT) / 100 + '%.');
    var json = JSON.stringify(data.log, null, 4);
    fs.writeFile('Battle Log.json', json, 'utf8', function () {
        console.log('Battle Log.json complete!');
    });
} else {
    // 多次模拟
    var statistic = [];
    var totalDps = 0;
    var startTime = Date.parse(new Date()) / 1000;
    console.log('Simulating ...');
    for (var i = 0; i < input.simulate.times; i++) {
        var data = sim.run(input);
        statistic.push(data.dps);
        totalDps += data.dps;
        /*if (data.dps > 5502) {
            times += 1;
        }*/
    }
    var endTime = Date.parse(new Date()) / 1000;
    console.log('Simulate of ' + input.job + ' finished, ' + input.simulate.times + ' times in total! Total time used: ' + Math.floor(endTime - startTime) + ' seconds!');
    console.log('Max dps: ' + Math.max.apply(Math, statistic));
    console.log('Min dps: ' + Math.min.apply(Math, statistic));
    console.log('Average dps: ' + Math.floor(100 * totalDps / input.simulate.times) / 100);
    //console.log('打爆木桩' + times + '次.');

}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};