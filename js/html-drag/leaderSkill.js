//==============================================================
//==============================================================
// Skill Function
//==============================================================
//==============================================================

//==============================================================
// ElementFactor
//==============================================================
var ElementFactor3Setting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var ElementFactor3Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}
var ElementFactor3_5Setting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var ElementFactor3_5Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}

//==============================================================
// Greek
//==============================================================
var GreekSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var GreekSkill = function( VAR, direct ){
    var color = VAR['COLOR'];
    var check_straight = 0;
    var check_horizontal = 0;
    for(var i = 0; i < TD_NUM; i++ ){ check_straight += STRAIGHT_SETS[i].length; }
    for(var i = 0; i < TR_NUM; i++ ){ check_horizontal += HORIZONTAL_SETS[i].length; }

    var num = 0;
    num += VAR['COUNT'];
    for(var set of GROUP_SETS[color]){
        num += set.size;
    }

    while( num >= 3 ){
        num -= 3;
        var rand_i;
        if( COMBO_TIMES == 1 && check_straight == 1 ||
            COMBO_TIMES == 1 && check_horizontal == 1 ){
            console.log(REMOVE_STACK);
            rand_i = Math.floor( randomBySeed() * ( REMOVE_STACK.length-1 ) );
        }else{
            rand_i = Math.floor( randomBySeed() *REMOVE_STACK.length );
        }
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color+'+';
    }

    VAR['COUNT'] = num;
}

//==============================================================
// Couple
//==============================================================
var CoupleSetting = function( MEMBER ){
    TEAM_COLORS_CHANGEABLE = false;
    GROUP_SIZE[ MEMBER['color'] ] = 2;
    GROUP_SIZE['h'] = 2;
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var CoupleEndSkill = function( VAR, direct ){
    turnRandomElementToColorByConfig( {
        color          : VAR['COLOR'],
        num            : 2,
        priorityColors : [ ['l', 'd'], ['w', 'h'], ['f', 'p'] ],
    } );
}

//==============================================================
// Doll
//==============================================================
var DollHumanDragonAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'DRAGON', 'OTHER' ],
            check : [ '{0}>=1', '{1}>=2', '{2}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanDragon'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "DRAGON" ){ return 2; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DollHumanBeastSpiritAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'BEAST', 'SPIRIT', 'OTHER' ],
            check : [ '{0}>=1', '({1}+{2})>=2', '{3}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanBeastSpirit'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "BEAST" || member['type'] == "SPIRIT" ){ return 2.5; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }            
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DollHumanDevilSpiritAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'DEVIL', 'SPIRIT', 'OTHER' ],
            check : [ '{0}>=1', '({1}+{2})>=2', '{3}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanDevilSpirit'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "DEVIL" || member['type'] == "SPIRIT" ){ return 2.5; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }            
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DollHumanGodAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'GOD', 'OTHER' ],
            check : [ '{0}>=1', '{1}>=2', '{2}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanGod'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "GOD" ){ return 2; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }            
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}

//==============================================================
// Tribe Beast
//==============================================================
var TribeBeastSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var TribeBeastAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var colorArr = ['w', 'f', 'p', 'l', 'd'];
    colorArr.splice( colorArr.indexOf(color), 1 );
    var belong_factor = 0;
    for( var member of TEAM_MEMBERS ){
        if( member['type'] == 'BEAST' ){
            belong_factor += 0.1;
        }
    }
    belong_factor = Math.min( belong_factor, 0.5 );
    for(var c of colorArr){
        COUNT_BELONG_COLOR[ color ][ c ] += belong_factor;
    }

    COUNT_FACTOR['TribeBeast'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['type'] == 'BEAST' ){  return true; }
            return false;
        },
    };
}

//==============================================================
// Sword
//==============================================================
var SwordBrotherPlusAttack = function( VAR, direct ){
    addColorBelongsByConfig( { 'l': { 'd': 0.5 }, 'd': { 'l': 0.5 } } );
    COUNT_FACTOR['SwordBrotherPlus'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['SwordBrotherPlusBoth'+direct] = {
        factor    : function( member, member_place ){ return 1.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( COUNT_AMOUNT['l'] > 0 && COUNT_AMOUNT['d'] > 0 ){ return true; }
            return false;
        },
    };
}

//==============================================================
// Babylon
//==============================================================
var BabylonSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var BabylonSkill = function( VAR, direct ){
    var color = VAR['COLOR'];
    for(var i = 0; i < TD_NUM; i++){
        var trigger = false;
        for(var set of STRAIGHT_SETS[i]){
            if( set.size >= 4 ){
                trigger = true;
                break;
            }
        }
        if( trigger && DROP_WAVES == 0 ){
            for(var id = (TR_NUM-1)*TD_NUM+i; id >= 0; id -= TD_NUM ){
                if( REMOVE_STACK.indexOf(id) >= 0 ){
                    REMOVE_STACK.splice( REMOVE_STACK.indexOf(id), 1 );
                    DROP_STACK[i].push( newElementByItem( color ) );
                    break;
                }
            }
        }
    };
}
var BabylonAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['Babylon'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}
var BabylonAttackPlus = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['BabylonPlus'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}

//==============================================================
// Chinese Paladin
//==============================================================
var LIXIAOYAOSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var LIXIAOYAOAttack = function( VAR, direct ){
    if( 'HeartProb' in COUNT_FACTOR ){
        COUNT_FACTOR['HeartProb']['prob'] += 0.5;
    }else{
        COUNT_FACTOR['HeartProb'] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 0.5,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['h'] > 0 ){
                    return checkMembersColorByConfig( { 
                        colors : [ 'w', 'f', 'p', 'OTHER' ],
                        check  : [ '{0}>=1', '{1}>=1', '{2}>=1', '{3}==0' ]
                    } );
                }
                return false;
            },
        };
    }

    COUNT_FACTOR['LIXIAOYAOAttack'+direct] = {
        factor    : function( member, member_place ){            
            var num = 0;
            for( var key in COUNT_AMOUNT ){
                num += COUNT_AMOUNT[key];
            }
            var factor = 1.8;
            var rate = 0.15;
            while( num > 0 && rate > 0 ){
                if( num >= 5 ){
                    factor += 5*rate;
                    rate -= 0.02;
                    num -= 5;
                }else{
                    factor += num*rate;
                    rate -= 0.02;
                    num -= num;
                }
            }
            return factor;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var CommonSourcePlusAttack = function( VAR, direct ){
    if( 'HeartProb' in COUNT_FACTOR ){
        COUNT_FACTOR['HeartProb']['prob'] += 0.5;
    }else{
        COUNT_FACTOR['HeartProb'] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 0.5,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['h'] > 0 ){ 
                    return checkMembersColorByConfig( { 
                        colors : [ 'w', 'f', 'p', 'OTHER' ],
                        check  : [ '{0}>=1', '{1}>=1', '{2}>=1', '{3}==0' ]
                    } );
                }
                return false;
            },
        };
    }

    if( checkMembersColorByConfig( { 
            colors : [ 'w', 'f', 'p', 'OTHER' ],
            check  : [ '{0}>=1', '{1}>=1', '{2}>=1', '{3}==0' ]
        } ) ){
        setColorBelongsByConfig( { 'w' : { 'f': 1, 'p': 1 },  'f': { 'w': 1, 'p': 1 },  'p': { 'w': 1, 'f': 1 } } );
    }

    if( COUNT_AMOUNT['w'] > 0 && COUNT_AMOUNT['f'] > 0 && COUNT_AMOUNT['p'] > 0 ){  
        COUNT_FACTOR['CommonSourcePlus'+direct] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}

//==============================================================
// DarkLucifer
//==============================================================
var WaterFairySetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var WaterFairyAttack = function( VAR, direct ){
    COUNT_FACTOR['WaterFairy'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == VAR['COLOR'] ){ return true; }
            return false;
        },
    };

    if( checkFirstHorizentalClearByPlace( TR_NUM-1 ) ){
        COUNT_FACTOR['WaterFairyBaseLine'+direct] = {
            factor    : function( member, member_place ){
                if( TEAM_MEMBERS[member_place]['id'] == 'WATER_FAIRY' && 
                    ( member_place == 0 || member_place == (TD_NUM-1) ) ){
                    return 3;
                }
                return 1;
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DarkLuciferSetting = function( MEMBER ){
    return {
        COLOR : 'h',
    };
}
var DarkLuciferAttack = function( VAR, direct ){
    COUNT_FACTOR['DarkLucifer'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}

//==============================================================
// DevilIllusion
//==============================================================
var DevilIllusionSetting = function( MEMBER ){
    return {
        COLOR     : MEMBER['color'],
        MAX_COLOR : '',
    };
}
var DevilIllusionFindMaxColor = function( VAR, direct ){
    var max_color = findMaxColorOfColorArr( [ 'w', 'f', 'p', 'l', 'd' ] );

    VAR['MAX_COLOR'] = '';
    if( max_color['num'] > 0 ){
        if( max_color['colors'].indexOf( VAR['COLOR'] ) >= 0 ){
            VAR['MAX_COLOR'] = VAR['COLOR'];
        }else{
            VAR['MAX_COLOR'] = max_color['colors'][ Math.floor( randomBySepcialSeed( max_colors['num'] ) * max_color['colors'].length) ];
        }
    }

    $("#BattleInfomation").append( 
        $("<span></span>").text( "判定最多粒符石屬性為 : "+COLOR_LETTERS[0][ VAR['MAX_COLOR'] ] ) 
    ).append("<br>");    
}
var DevilIllusionAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var max_color = VAR['MAX_COLOR'];
    COUNT_FACTOR['DevilIllusion'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    if( max_color == color ){
        COUNT_FACTOR['DevilIllusionBelong'+direct] = {
            factor    : function( member, member_place ){ return 1.4; },
            prob      : 1,
            condition : function( member, member_place ){
                if( member['color'] == color ){ return true; }
                return false;
            },
        };
    }else{
        if( max_color in COUNT_BELONG_COLOR ){
            COUNT_BELONG_COLOR[max_color][color] += 0.5;
        }
    }
}
var DevilIllusionPlusAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var max_color = VAR['MAX_COLOR'];
    COUNT_FACTOR['DevilIllusion'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    if( max_color == color ){
        COUNT_FACTOR['DevilIllusionBelong'+direct] = {
            factor    : function( member, member_place ){ return 1.4; },
            prob      : 1,
            condition : function( member, member_place ){
                if( member['color'] == color ){ return true; }
                return false;
            },
        };
    }else{
        if( max_color in COUNT_BELONG_COLOR ){
            COUNT_BELONG_COLOR[max_color][color] += 0.5;
        }
    }
}

//==============================================================
// DevilCircle
//==============================================================
var DevilCircleSetting = function( MEMBER ){
    TIME_LIMIT += 1;
    $('#timeRange').val( TIME_LIMIT );
    return {
        COLOR : MEMBER['color']
    };
}
var DevilCircleAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['DevilCircle'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['DevilCircle5Set'+direct] = {
        factor    : function( member, member_place ){ return 1.5; },
        prob      : 1,
        condition : function( member, member_place ){
            for(var obj of COMBO_STACK){
                if( obj['color'] == color && obj['amount'] >= 5 ){
                    return true;
                }
            }
            return false;
        },
    };
}

//==============================================================
// ChinaGod
//==============================================================
var ChinaDAttack = function( VAR, direct ){
    COUNT_COMBO_COEFF += 1.25;
}

//==============================================================
// HeartQueen
//==============================================================
var HeartQueenSetting = function( MEMBER ){
    return {
        COLOR : 'h',
        COUNT : 0,
    };
}

//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var LEADER_SKILLS_DATA = {
    NONE : {
        id        : 'NONE',
        label     : "靈魂收割 ‧ 結",
        info      : "當敵方生命力 40% 以下，無視防禦力和屬性，每回合以自身攻擊力 6 倍追打 1 次",
        letter    : [0,0],
        preSet    : noneSetting,
    },
    WILL_POWER : {
        id        : 'WILL_POWER',
        label     : "絕境意志",
        info      : "當前生命力大於 50% 時，下一次所受傷害不會使你死亡 (同一回合只會發動一次）",
        letter    : [0,0],
        preSet    : noneSetting,
    },
    ELEMENT_FACTOR3 : {
        id        : "ELEMENT_FACTOR3",
        label     : "{0}之震怒",
        info      : "{0}屬性攻擊力 3 倍",
        letter    : [0,0],
        attack    : ElementFactor3Attack,
        preSet    : ElementFactor3Setting,
    },
    ELEMENT_FACTOR3_5 : {
        id        : "ELEMENT_FACTOR3_5",
        label     : "{0}怒嘯",
        info      : "{0}屬性攻擊力 3.5 倍",
        letter    : [3,0],
        attack    : ElementFactor3_5Attack,
        preSet    : ElementFactor3_5Setting,
    },
    CHINA_D : {
        id        : "CHINA_D",
        label     : "傾世絕色",
        info      : "連擊 (Combo) 時攻擊力大幅提升 125%",
        letter    : [0,0],
        attack    : ChinaDAttack,
        preSet    : noneSetting,
    },
    GREEK : {
        id        : 'GREEK',
        label     : "{0}之連動",
        info      : "每累計消除 3 粒{0}符石 ，將產生 1 粒{0}強化符石",
        letter    : [0,0],
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    HEART_QUEEN : {
        id        : 'HEART_QUEEN',
        label     : "{0}之連動",
        info      : "每累計消除 3 粒{0}符石 ，將產生 1 粒{0}強化符石",
        letter    : [0,0],
        newItem   : GreekSkill,
        preSet    : HeartQueenSetting,
    },
    COUPLE_F : {
        id        : 'COUPLE_F',
        label     : "火靈符籙",
        info      : "2 粒火符石或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)。回合結束時，將 2 粒符石轉化為火符石 (光及暗符石優先轉換)",
        letter    : [0,0],
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    COUPLE_P : {
        id        : 'COUPLE_P',
        label     : "木靈符籙",
        info      : "2 粒木符石或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)。回合結束時，將 2 粒符石轉化為木符石 (光及暗符石優先轉換)",
        letter    : [0,0],
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    DOLL_HUMAN_DRAGON : {
        id        : 'DOLL_HUMAN_DRAGON',
        label     : '龍魂輔主',
        info      : '當隊伍中只有人類及 2 個或以上龍類成員時，人類攻擊力 3.5 倍，龍類攻擊力 2 倍',
        letter    : [0,0],
        attack    : DollHumanDragonAttack,
        preSet    : noneSetting,
    },
    DOLL_HUMAN_BEAST_SPIRIT : {
        id        : 'DOLL_HUMAN_BEAST_SPIRIT',
        label     : '幻獸輔主',
        info      : '當隊伍中只有人類、2 個或以上獸類或妖精類成員時，人類攻擊力 3.5 倍，獸類及妖精類攻擊力 2.5 倍',
        letter    : [0,0],
        attack    : DollHumanBeastSpiritAttack,
        preSet    : noneSetting,
    },
    DOLL_HUMAN_DEVIL_SPIRIT : {
        id        : 'DOLL_HUMAN_DEVIL_SPIRIT',
        label     : '妖魔輔主',
        info      : '當隊伍中只有人類、2 個或以上魔族或妖精類成員時，人類攻擊力 3.5 倍，魔族及妖精類攻擊力 2.5 倍',
        letter    : [0,0],
        attack    : DollHumanDevilSpiritAttack,
        preSet    : noneSetting,
    },
    DOLL_HUMAN_GOD : {
        id        : 'DOLL_HUMAN_GOD',
        label     : '神靈輔主',
        info      : '當隊伍中只有人類及 2 個或以上神族成員時，人類攻擊力 3.5 倍，神族攻擊力 2 倍',
        letter    : [0,0],
        attack    : DollHumanGodAttack,
        preSet    : noneSetting,
    },
    TRIBE_BEAST : {
        id        : 'TRIBE_BEAST',
        label     : '{0}影世界 ‧ 獸',
        info      : '獸類攻擊力 2.5 倍；{0}符石兼具所有屬性符石效果，每個獸類成員提升 10% 效果，最高 50% (效果可以疊加)',
        letter    : [2,0],
        attack    : TribeBeastAttack,
        preSet    : TribeBeastSetting,
    },
    BABYLON : {
        id        : 'BABYLON',
        label     : '穹蒼之賜 ‧ {0}',
        info      : '{0}屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒{0}符石',
        letter    : [0,0],
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BabylonSetting,
    },
    BABYLON_PLUS : {
        id        : 'BABYLON_PLUS',
        label     : '穹蒼之賜 ‧ {0}',
        info      : '{0}屬性攻擊力 3 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒{0}符石',
        letter    : [3,0],
        newItem   : BabylonSkill,
        attack    : BabylonAttackPlus,
        preSet    : BabylonSetting,
    },
    SWORD_BROTHER_PLUS : {
        id        : 'SWORD_BROTHER_PLUS',
        label     : '陰陽煞陣 ‧ 強',
        info      : '光和暗屬性攻擊力 2.5 倍；光符石兼具 50% 暗符石效果，暗符石兼具 50% 光符石效果 (效果可以疊加)；同時消除光符石及暗符石，光和暗屬性攻擊力額外提升 1.5 倍 (效果可以疊加)',
        letter    : [0,0],
        attack    : SwordBrotherPlusAttack,
        preSet    : noneSetting,
    },
    COMMON_SOURCE_PLUS : {
        id        : 'COMMON_SOURCE_PLUS',
        label     : '仙劍同源 ‧ 強',
        info      : '隊伍中只有水、火及木屬性的成員時，水符石兼具火及木符石效果、火符石兼具水及木符石效果，同時木符石兼具水及火符石效果 (不能疊加)；消除心符石時攻擊力有 50% 機會額外提升 1.5 倍 (機率可以疊加)。同時消除水、火及木符石時，全隊攻擊力額外提升 1.5 倍',
        letter    : [0,0],
        attack    : CommonSourcePlusAttack,
        preSet    : noneSetting,
    },
    LIXIAOYAO : {
        id        : 'LIXIAOYAO',
        label     : '逍遙神劍',
        info      : '全隊攻擊力 1.8 倍；消除的符石數量愈多 (主動技能除外)，全隊攻擊力額外提升愈多 (不能疊加)。隊伍中只有水、火及木屬性的成員時，消除心符石時攻擊力有 50% 機會額外提升 1.5 倍 (機率可以疊加)',
        letter    : [0,0],
        attack    : LIXIAOYAOAttack,
        preSet    : LIXIAOYAOSetting,
    },
    WATER_FAIRY : {
        id        : 'WATER_FAIRY',
        label     : '流雲雙刃斬',
        info      : '水屬性攻擊力 2.5 倍；消除最底一橫行內的所有符石時，自身攻擊力額外提升 3 倍，若使用相同的隊長及戰友時，自身攻擊力額外提升至 9 倍',
        letter    : [0,0],
        attack    : WaterFairyAttack,
        preSet    : WaterFairySetting,
    },
    DARK_LUCIFER : {
        id        : 'DARK_LUCIFER',
        label     : '穹蒼之賜 ‧ 護心',
        info      : '全隊攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒心符石。生命力全滿時，所受傷害減少 20%',
        letter    : [0,0],
        newItem   : BabylonSkill,
        attack    : DarkLuciferAttack,
        preSet    : DarkLuciferSetting,        
    },
    DEVIL_ILLUSION : {
        id        : 'DEVIL_ILLUSION',
        label     : '無影幻像 ‧ {0}',
        info      : '{0}屬性攻擊力 3 倍，每回合場上數量最多的 1 種屬性符石兼具 50% {0}符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為{0}屬性符石時，則兼具效果變為{0}屬性攻擊力提升 1.4 倍 (可疊加)',
        letter    : [1,0],
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_PLUS : {
        id        : 'DEVIL_ILLUSION_PLUS',
        label     : '無垠幻像 ‧ {0}',
        info      : '{0}屬性攻擊力 3.5 倍，每回合場上數量最多的 1 種屬性符石兼具 50% {0}符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為{0}屬性符石時，則兼具效果變為{0}屬性攻擊力提升 1.4 倍 (可疊加)',
        letter    : [1,0],
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionPlusAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_CIRCLE : {
        id        : 'DEVIL_CIRCLE',
        label     : '{0}結陣 ‧ 繼',
        info      : '{0}屬性攻擊力 3 倍，並延長移動符石時間 1 秒；消除一組 5 粒或以上的{0}符石時，{0}屬性攻擊力額外提升 1.5 倍 (可疊加)',
        letter    : [1,0],
        attack    : DevilCircleAttack,
        preSet    : DevilCircleSetting,
    },
};