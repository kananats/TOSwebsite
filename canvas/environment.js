

var EnvironmentManager = function(){
    var LocusMode = {
        none    : 0,
        reverse : 1,
        unknown : 2,
        burn    : 3,
        inhibit : 4
    };

    var self = this;

    this.hNum = 0;
    this.vNum = 0;

    this.teamColors      = null;
    this.colorDrop       = null;
    this.colorProb       = null;
    this.colorMap        = null;
    this.colorChangeable = true;
    this.pairSize        = null;
    this.groupSize        = null;

    this.newDrop      = false;
    this.locusMode    = null;
    this.locusInf     = false;
    this.locusShow    = false; 
    this.locusPoints  = null;

    this.freeMove   = false;
    this.timeLimit  = 5;

    this.stopReplay   = false;
    this.showRecord   = false;
    this.replaySpeed  = 5;

    this.initialize = function(){
        self.hNum = 6;
        self.vNum = 5;

        self.resetColorSetting();
        self.setTeamColorProb();
    };

    // 重設新珠機率
    this.resetColorSetting = function(){
        self.teamColors      = new Array(self.hNum);
        self.colorDrop       = ['w', 'f', 'p', 'l', 'd', 'h'];
        self.colorProb       = new Array(self.hNum);
        self.colorMap        = {};
        self.colorChangeable = true;
        self.pairSize        = {w:3, f:3, p:3, l:3, d:3, h:3};
        self.groupSize       = {w:3, f:3, p:3, l:3, d:3, h:3};
        for(var i = 0; i < self.hNum; i++){
            self.colorProb[i] = {};
        }
    };
    // 設定落珠機率流程 
    this.resetTeamComposition = function(){
        self.resetColorSetting();

        //檢查落珠設定
        dropColorManager.setColor();
        //檢查隊伍技能
        teamManager.setTeamAbility();

        self.setTeamColorProb();
    }
    // 從落珠、禁珠、技能等統整 落珠機率
    this.setTeamColorProb = function(){
        for(var i = 0; i < self.hNum; i++){
            if( self.colorChangeable ){
                var team_colors = {}, tmp_colors = {};
                var prob = 0;
                var color_len = 0;

                // 計算出現過哪幾種屬性(有在colorProb直接設定的不用計算)
                for( var c of self.colorDrop ){
                    if( !(c in self.colorProb[i]) ){
                        tmp_colors[c] = ( c in tmp_colors ) ? tmp_colors[c]+1 : 1;
                        color_len++;
                    }
                }
                // 像昇華4直接設定落珠率的直接使用
                for( var c in self.colorProb[i] ){
                    team_colors[c] = prob + self.colorProb[i][c];
                    prob += self.colorProb[i][c];
                }
                // 最終的機率是累加
                var elseProb = 1 - prob;
                for( var c in tmp_colors ){
                    var c_prob = tmp_colors[c] * ( elseProb / color_len ) ;
                    team_colors[c] = prob + c_prob;
                    prob += c_prob;
                }

                self.teamColors[i] = ( team_colors );
            }else{
                self.teamColors[i] = ( {'w': 1/6, 'f': 2/6, 'p': 3/6, 
                                        'l': 4/6, 'd': 5/6, 'h': 6/6 } );
            }
        }
    };
    this.getColorIndex = function(color){
        var i = 0
        for(; i < COLORS.length; i++){
            if( COLORS[i] == color ){ return i; }
        }
        return null;
    }

    // 取得新珠的隨機顏色
    this.nextColorAtX = function(x){
        var colors = self.teamColors[x];
        var rand = randomNext();
        var color = 'w';

        for( var c in colors ){
            if( rand <= colors[c] ){
                color = c;
                break;
            }
        }
        if( color in self.colorMap ){
            color = self.colorMap[color];
        }
        return color;
    };

    // 設定新機率環境
    this.setColorDrop = function( colors ){
        self.colorDrop = colors;
    };
    this.setColorMap = function( map ){
        for(var key in map){
            self.colorMap[key] = map[key];
        }
    };
    this.setColorProb = function( prob, n ){
        for(var key in prob){
            self.colorProb[n][key] = prob[key];
        }
    };

    // 設定軌跡模式
    this.setLocusMode = function(mode){
        self.locusMode = mode;
    };
    this.hasLocus = function(){
        return self.locusMode != LocusMode.none;
    };
    this.isBallLocus = function(){
        return self.locusMode == LocusMode.reverse || self.locusMode == LocusMode.unknown;
    };
    this.isRecordLocus = function(){
        return self.locusMode == LocusMode.burn || self.locusMode == LocusMode.inhibit;
    };
    this.mapLocusItem = function(){
        if( self.locusMode == LocusMode.reverse ){ return "_"; }
        if( self.locusMode == LocusMode.unknown ){ return "q"; }
    };
    this.mapLocusColor = function(){
        if( self.locusMode == LocusMode.burn ){ return "red"; }
        if( self.locusMode == LocusMode.inhibit ){ return "green"; }
    };
    this.prepareDrawLocus = function(points){
        self.locusShow = true;
        self.locusPoints = points;
    };
    this.drawLocus = function(ctx){
        var point = self.locusPoints[0];
        ctx.save();
        ctx.beginPath();
        if( self.locusPoints.length > 1 ){
            ctx.moveTo( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2 );
            for(var i = 1; i < self.locusPoints.length; i++){
                point = self.locusPoints[i];
                ctx.lineTo( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2 );
            }
            ctx.lineWidth = BALL_SIZE/2;
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = self.mapLocusColor();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }else{
            ctx.arc( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2, BALL_SIZE/4, 0, 2*Math.PI );
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = 'rgba(0,0,0,0.0)';
            ctx.fillStyle   = self.mapLocusColor();
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    };
    this.checkLocusInhibit = function(point){
        if( self.locusMode != LocusMode.inhibit ){ return false; }
        for(var i = 0; i < self.locusPoints.length; i++){
            if( point.getGridX() == self.locusPoints[i].getGridX() &&
                point.getGridY() == self.locusPoints[i].getGridY() ){
                return true;
            }
        }
        return false;
    }

    // 設定重播速度
    this.resetReplaySpeed = function(){
        MOVE_FRAME    = 12-this.replaySpeed;
        REPLAY_SPEED  = BALL_SIZE / MOVE_FRAME;
    };

};