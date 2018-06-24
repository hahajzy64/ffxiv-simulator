﻿var potionEffect = 165;         // 4.3药水效果
var animationBlock = 67;        // 技能动作僵直默认0.67秒
const calculate = require('../calculate.js');

class skill {

    constructor(data) {
        // 同步战斗数据
        this.setting = data.setting;            // 初始化设定
        this.player = data.player;              // 玩家动态属性
        this.battle = data.battle;
        this.log = data.log;
    }

    // GCD计算
    calculateGCD() {
        var baseGCD = Math.floor(100 * (Math.floor(1000 * 2.5 * (1 - Math.floor(130 * (this.player.status.ss - 364) / 2170) / 1000)) / 1000));
        var m = (this.isBuff('feys_wind')) ? (1 - 0.03) : 1;
        return Math.floor(baseGCD * m);
    }

    // buff检测
    isBuff(name) {
        if (typeof this.player.buff[name] !== 'undefined' && this.player.buff[name] > 0) {
            return true;
        } else {
            return false;
        }
    }

    /** 
     * 下面是技能释放代码
     * */
    malefic_iii() {
        this.player.casting = 'malefic_iii';
        //this.player.resource.mp -= 1080;
        this.player.tick.animation = animationBlock;
        this.player.tick.gcd = this.calculateGCD();
        this.player.tick.cast = this.calculateGCD();
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'cast',
            'name': 'Malefic III',
            'duration': this.player.tick.cast,
            'resource': this.player.resource
        });
    }
    combust_ii() {
        this.player.tick.animation = animationBlock;
        this.player.tick.gcd = this.calculateGCD();
        this.battle.skillEffectQue.push({
            'time': 67,
            'name': 'combust_ii'
        });
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'cast',
            'name': 'Combust II',
            'duration': 0,
            'resource': this.player.resource
        });
    }
    potion() {
        this.player.tick.animation = animationBlock;
        this.player.cd.potion = 27000;
        this.battle.skillEffectQue.push({
            'time': 67,
            'name': 'potion'
        });
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'cast',
            'name': 'Potion',
            'duration': 0,
            'resource': this.player.resource
        });
    }
    cleric_stance() {
        this.player.tick.animation = animationBlock;
        this.player.cd.cleric_stance = 9000;
        this.battle.skillEffectQue.push({
            'time': 67,
            'name': 'cleric_stance'
        });
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'cast',
            'name': 'Cleric Stance',
            'duration': 0,
            'resource': this.player.resource
        });
    }

}

class effect {

    constructor(data) {
        // 同步战斗数据
        this.setting = data.setting;            // 初始化设定
        this.player = data.player;              // 玩家动态属性
        this.battle = data.battle;
        this.log = data.log;
    }

    /** 
     * 下面是技能生效代码
     * */
    malefic_iii() {
        var potency = 220;
        var damage = calculate.damageCalculate(this,potency);
        this.battle.damageQue.push({
            'time': 50 + 60,
            'name': 'Malefic III',
            'damage': damage.damage,
            'crit': damage.crit,
            'dh': damage.dh
        });
    }
    combust_ii() {
        var potency = 50;
        var damage = calculate.dotBaseDamageCalculate(this,potency);
        this.player.dot.combust_ii.time = 3000;
        this.player.dot.combust_ii.damage = damage;
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'DOT Apply',
            'name': 'Combust II',
            'base_damage': damage,
            'duration': 3000
        });
    }
    potion() {
        this.player.buff.potion = 3000;
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'Buff Apply',
            'name': 'Potion',
            'duration': 3000
        });
    }
    cleric_stance() {
        this.player.buff.cleric_stance = 1500;
        this.log.push({
            'time': this.setting.simulate.duration - this.battle.time,
            'event': 'Buff Apply',
            'name': 'Cleric Stance',
            'duration': 1500
        });
    }

}

class buff {

    constructor(data) {
        // 同步战斗数据
        this.setting = data.setting;            // 初始化设定
        this.player = data.player;              // 玩家动态属性
        this.battle = data.battle;
        this.log = data.log;
    }

    check() {
        if (this.isBuff('potion')) {
            this.player.status.ap = this.setting.player.ap + potionEffect;
        } else {
            this.player.status.ap = this.setting.player.ap;
        }
    }

    // buff检测
    isBuff(name) {
        if (typeof this.player.buff[name] !== 'undefined' && this.player.buff[name] > 0) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = {

    'buffCheck': function (data) {
        var b = new buff(data);
        b.check();
        return b;
    },
    'cast': function (data, name) {
        var s = new skill(data);
        if (name == 'malefic_iii') {
            s.malefic_iii();
        } else if (name == 'combust_ii') {
            s.combust_ii();
        } else if (name == 'potion') {
            s.potion();
        } else if (name == 'cleric_stance') {
            s.cleric_stance();
        }
        return s;
    },
    'effect': function (data, name) {
        var e = new effect(data);
        if (name == 'malefic_iii') {
            e.malefic_iii();
        } else if (name == 'combust_ii') {
            e.combust_ii();
        } else if (name == 'potion') {
            e.potion();
        } else if (name == 'cleric_stance') {
            e.cleric_stance();
        }
        return e;
    }

};