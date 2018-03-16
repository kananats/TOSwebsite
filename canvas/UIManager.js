
// =================================================================
// 時間/血條
// =================================================================
var BarManager = function(canvas, environment){
    var self = this;

    this.canvas = canvas;
    this.environment = environment;

    this.timeIcon = null;
    this.timeGrad = null;
    this.lifeIcon = null;
    this.lifeGrad = null;

    this.initialize = function(){
        self.canvas.attr('width', self.environment.hNum * BALL_SIZE).attr('height', ICON_SIZE);
        var ctx = self.canvas.get(0).getContext('2d');

        self.timeIcon = new Image();
        self.timeIcon.src = "img/UI/clock.png";
        self.lifeIcon = new Image();
        self.lifeIcon.src = "img/UI/heart.png";
        self.timeGrad = new Image();
        self.timeGrad.src = "img/UI/timeclip.png";
        self.lifeGrad = new Image();
        self.lifeGrad.src = "img/UI/lifeclip.png";
    };
    this.resetTime = function(){
        var ctx = self.canvas.get(0).getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, self.canvas.width(), self.canvas.height());
        
        ctx.fillStyle = "black";;
        ctx.fillRect(ICON_SIZE, 0, self.canvas.width()-ICON_SIZE, self.canvas.height());

        ctx.drawImage(self.timeGrad, ICON_SIZE, 0, self.canvas.width(), ICON_SIZE);
        ctx.drawImage(self.timeIcon, 0, 0, ICON_SIZE, ICON_SIZE);

        ctx.restore();
    };
    this.drawTimeBar = function(fraction){
        var length = ( self.canvas.width()-ICON_SIZE ) * fraction;
        var ctx = self.canvas.get(0).getContext('2d');

        ctx.save();
        ctx.clearRect(0, 0, self.canvas.width(), self.canvas.height());
        
        ctx.fillStyle = "black";;
        ctx.fillRect(ICON_SIZE, 0, self.canvas.width()-ICON_SIZE, self.canvas.height());

        ctx.drawImage(self.timeGrad, 0, 0, length, 32,
                                     ICON_SIZE, 0, length, ICON_SIZE);
        ctx.drawImage(self.timeIcon, 0, 0, ICON_SIZE, ICON_SIZE);

        ctx.restore();
    }
}

// =================================================================
// combo計數器
// =================================================================
var ComboManager = function( scrollbar, comboInfo, historyManager ){
    var self = this;
    this.historyManager = historyManager;

    this.scrollbar = scrollbar;
    this.comboBox  = scrollbar.find("#comboBox");
    this.comboInfo = comboInfo;

    this.moveNum = 0;
    this.comboNum = 0;
    this.extraComboNum = 0;
    this.waveNum = 0;

    this.initialize = function(){
        self.scrollbar.mCustomScrollbar({
            axis  : "y",
            theme : "dark-thick",
        });
    };
    this.resetBox = function(){
        self.moveNum = 0;
        self.comboNum = 0;
        self.extraComboNum = 0;
        self.waveNum = 0;

        self.comboInfo.find('span').text('');
        self.comboBox.children().remove();
        self.scrollbar.mCustomScrollbar("update");
    };
    this.addMove = function(){
        ++ self.moveNum;
        self.comboInfo.find('#moveNum').text( self.moveNum );
    }
    this.addComboSet = function( ballPair ){
        ++ self.comboNum;
        self.comboInfo.find('#comboNum').text( self.comboNum );

        var div = $("<div>").addClass("imgComboSet");
        for(var i = 0; i < ballPair.length; i++){
            var image = $("<img>");
            if( TOUCH_DEVICE ){ image.addClass("img-btn-sm"); }
            else{ image.addClass("img-btn-lg"); }
            image.attr("src", ballPair[i].mapColorSrc());
            image.attr("title", ballPair[i].itemInfomation());
            div.append(image);
        }
        self.comboBox.append(div.append("<hr>"));
        self.scrollbar.mCustomScrollbar("update");
    }
    this.addWave = function( waveNum ){
        if( waveNum == 0 ){
            self.comboBox.append( $("<div align='center'>First Batch</div><hr>").addClass("comboLabel") );
        }else if( waveNum == 1 ){
            self.comboBox.append( $("<div align='center'>Skydrop</div><hr>").addClass("comboLabel") );
        }
    };

};



// =================================================================
// 落珠選擇
// =================================================================
var DropColorManager = function( selector, scrollbar, environment ){
    var Mode = {
        normal   : 0,
        withoutH : 1,
        HmapW    : 2,
        HmapF    : 3,
        HmapP    : 4,
        HmapL    : 5,
        HmapD    : 6,
        unknown  : 7,
        optional : 8,
    };

    var self = this;

    this.selector     = selector;
    this.scrollbar    = scrollbar;
    this.optionalList = scrollbar.find("#OptionalColors");
    this.environment  = environment;

    this.mode = Mode.normal;

    this.initialize = function(){        
        var amount = Math.max.apply(
            Math, $("#DropColorScrollbar li").map(
                function(){return $(this).outerWidth(true);} ).get() );
        self.scrollbar.mCustomScrollbar({
            axis:"x",
            theme:"minimal-dark",
            advanced:{ autoExpandHorizontalScroll: true },
            snapAmount: amount,
        });
        self.scrollbar.hide();

        if( TOUCH_DEVICE ){ 
            self.scrollbar.css('height','70px');
            self.scrollbar.find('.addNewColor').css('width','30px').css('height','25px'); 
        }else{ 
            self.scrollbar.css('height','80px');
            self.scrollbar.find('.addNewColor').css('width','50px').css('height','40px');
        }
    };

    this.setMode = function(val){
        self.mode = parseInt(val);
        if( self.mode == Mode.optional ){
            self.startOptional();
        }else{
            self.closeOptional();
        }
    }
    this.setColor = function(){
        switch( self.mode ){
            case Mode.normal   : 
                environmentManager.setColorDrop( ['w', 'f', 'p', 'l', 'd', 'h'] ); break;
            case Mode.withoutH : 
                environmentManager.setColorDrop( ['w', 'f', 'p', 'l', 'd'] ); break;
            case Mode.HmapW    : 
                environmentManager.setColorMap( { h : 'w' } ); break;
            case Mode.HmapF    : 
                environmentManager.setColorMap( { h : 'f' } ); break;
            case Mode.HmapP    : 
                environmentManager.setColorMap( { h : 'p' } ); break;
            case Mode.HmapL    : 
                environmentManager.setColorMap( { h : 'l' } ); break;
            case Mode.HmapD    : 
                environmentManager.setColorMap( { h : 'd' } ); break;
            case Mode.unknown  :
                for(var i = 0; i < environmentManager.hNum; i++){
                    var prob = { wq:0.1/6, fq:0.1/6, pq:0.1/6, lq:0.1/6, dq:0.1/6, hq:0.1/6 };
                    environmentManager.setColorProb( prob, i ); 
                }
                break;
            case Mode.optional : 
                var colors = self.getOptionalColors(); 
                environmentManager.setColorDrop( colors );
                break;
        };
    };

    this.startOptional = function(){
        self.scrollbar.show();
        self.optionalList.find("li.option").remove();
        initialOptional = ['w', 'f', 'p', 'l', 'd', 'h'];
        for(var i = 0; i < initialOptional.length; i++){
            self.addColor( initialOptional[i] );
        }
    };
    this.addColor = function(item){
        var ball = new Ball( new Point(), item, BALL_SIZE );
        var image = $("<img>").attr("src", ball.mapColorSrc());
        if( TOUCH_DEVICE ){ image.addClass("img-btn-sm"); }
        else{ image.addClass("img-btn-lg"); }
        image.attr("item",item);
        image.attr("title",ball.itemInfomation());
        var li = $("<li></li>").addClass('option').append(image);
        li.attr("onclick","$(this).remove()");
        self.optionalList.find("li").eq(-1).before(li);
        self.scrollbar.mCustomScrollbar("update");
    };
    this.closeOptional = function(){
        self.scrollbar.hide();
        self.optionalList.find("li.option").remove();
        self.scrollbar.mCustomScrollbar("update");
    }
    this.getOptionalColors = function(){
        var colors = new Array();
        self.optionalList.find('img').each(function(){
            colors.push( $(this).attr('item') );
        });
        return colors;
    }
};

function selectDropColor(button){
    dropColorManager.setMode( $(button).val() );
}
function addColorIntoBar(){
    if( CREATE_COLOR.color == null ){ return; }
    item = CREATE_COLOR.color;
    if( CREATE_COLOR.strong  ){ item += "+"; }
    if( CREATE_COLOR.inhibit ){ item += "x"; }
    if( CREATE_COLOR.weather ){ item += "*"; }
    if( CREATE_COLOR.frozen  ){ item += "i"+CREATE_COLOR.frozen; }
    if( CREATE_COLOR.locking ){ item += "k"; }
    if( CREATE_COLOR.unknown ){ item += "q"; }
    if( CREATE_COLOR.reverse ){ item += "_"; }
    dropColorManager.addColor(item);
}


