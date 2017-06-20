<template>
    <transition name="move">
        <div class="food" v-show="showFlag" ref="food">
        <!-- 必须包含一个子层 才能使用better-scroll -->
           <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="食物图片">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title"> {{ food.name }} </h1>
                    <div class="detail"> 
                        <span class="sellCount"> 月售{{ food.sellCount }}份 </span>
                        <span class="rating">好评率 {{ food.rating }}</span>
                    </div>
                    <div class="price">
                        <span class="new"> ￥{{ food.price }}</span>
                        <span class="old" v-show="food.oldPrice"> ￥{{food.oldPrice}} </span>
                    </div>
                    <div class="cartcontrol-wrapper">
                         <cartcontrol :food="food" ></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div @click="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text" > {{ food.info }} </p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect @select="changeType" @toggleContent="changeOnlyContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings&&food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px " >
                                <div class="user">
                                    <span class="name"> {{ rating.username }} </span>
                                    <img class="avatar" :src="rating.avatar" width="12px" height="12px"> </img>
                                </div>
                                <div class="time"> {{ rating.rateTime |  formatDate }}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span>
                                    {{ rating.text }}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
           </div>
        </div>
    </transition>
</template>
<script>
    import Vue from 'vue'
    import cartcontrol from '../cartcontrol/cartcontrol'
    import split from '../split/split'
    import ratingselect from '../ratingselect/ratingselect'
    //带花括号的是去export一个function，可以引入多个模块
    import {formatDate} from '../../common/js/data.js'
    import BScroll from 'better-scroll'
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;
    //全局注册一个过滤器
    Vue.filter( 'formatDate' , function(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
    });

    export default {
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all:'全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            }
        },
        methods: {
            // 父组件可以调用子组件 若为私有 则命名为_show
            show() {
                this.showFlag = true;
                // 保证初始化
                this.selectType = ALL;
                this.onlyContent = true;
                this.$nextTick(() => {
                    if(!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            probeType: 3,
                            click: true
                        })
                    } else {
                        this.scroll.refresh();
  
                  
                    }
                });
            },
            hide() {
                this.showFlag = false;
            },
            addFirst(event) {
                if(!event._constructed) {
                    return;
                }
                this.$emit('add', event.target);
                Vue.set(this.food, 'count', 1);
            },
            needShow(type, text) {
                if(this.onlyContent && !text) {
                    return false;
                }
                if(this.selectType === ALL) {
                    return true;
                }
                if(this.selectType === type) {
                    return true;
                }
                return false;
            },
            changeOnlyContent(content) {
                this.onlyContent = content;
                this.$nextTick(() => {
                     this.scroll.refresh();
                });
            },
            changeType(type) {
                this.selectType = type;
                this.$nextTick(() => {
                     this.scroll.refresh();
                });
            },
            // filters: {
            //     formatDate(time) {
            //         let data = new Date(time);
            //         return formatDate(date, 'yyyy-MM-dd hh:mm');
            //     }
            // }
        }
    }
</script>
<style lang="stylus">
    @import '../../common/stylus/mixin.styl'
    .move-enter-active, &.move-leave-active 
        transition: all 0.3s linear               
    .move-enter, &.move-leave-active 
        opacity: 0
        transform: translate3d(100%, 0, 0) 
    .food 
        position: fixed
        left: 0
        top: 0
        bottom: 48px
        z-index: 1
        width: 100%
        background: #fff
        .image-header
            position: relative
            width: 100%
            height: 0
            padding-top: 100%
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute
                top: 10px
                left: 0
                .icon-arrow_lift
                    display: block
                    padding: 10px
                    font-size: 20px
                    color: #fff
        .content
            position: relative
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 8px
                font-size: 14px
                font-weight: 700
                color: rgb(7, 17, 27)
            .detail
                margin-bottom: 18px
                line-height: 10px
                font-size: 0
                .sellCount, .rating
                    font-size: 10px
                    color: rgb(147, 153, 159)
                .rating
                    margin-left: 12px
            .price
                font-weight: 700
                line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240, 20, 20)
              .old 
                text-decoration: line-through
                font-size: 10px
                color: rgb(147, 153, 159)
            .cartcontrol-wrapper
                position: absolute
                right: 12px
                bottom: 12px
            .buy
                position: absolute
                right: 18px
                bottom: 18px
                z-index: 10
                height: 24px
                line-height: 24px
                padding: 0 12px
                box-sizing: border-box
                border-radius: 12px
                font-size: 10px
                color: #fff
                background-color: rgb(0, 160, 220)
                &.fade-enter-active, &.fade-leave-active 
                    transition: all 0.3s linear               
                &.fade-enter, &.fade-leave-active 
                    opacity: 0
        .info
            padding: 18px
            .title  
                line-height 14px
                margin-bottom 6px
                font-size: 14px
                color rgb(7, 17, 27)
            .text
                padding 0  8px
                line-height 24px
                font-size 12px
                color rgb(77, 85, 93)
        .rating
            padding-top 18px
            .title  
                line-height 14px
                margin-left 18px
                font-size: 14px
                color rgb(7, 17, 27)
            .rating-wrapper
                padding: 0 18px
                .rating-item
                    position relative
                    padding  16px  0
                    border-1px(rgba(7, 17, 27, 0.1))
                    .user
                        position absolute
                        right 0
                        top 16px
                        line-height 12px
                        font-size: 0
                        .name
                            display inline-block
                            margin-right 6px
                            vertical-align top
                            font-size 10px
                            color rgb(147, 153, 159)
                        .avatar 
                            display inline-block
                            border-radius 50%
                    .time
                        margin-bottom 6px
                        line-height 12px
                        font-size 10px
                        color rgb(147, 153, 159)
                    .text
                        line-height 16px
                        font-size 12px
                        color rgb(7, 17, 27)
                        .icon-thumb_up, .icon-thumb_down
                            line-height 16px
                            margin-right 4px
                            font-size 12px
                        .icon-thumb_down
                            color rgb(147, 153, 159)
                        .icon-thumb_up
                            color rgb(0, 160, 220)
                .no-rating
                    padding 16px  0
                    font-size 12px
                    color rgb(147, 153, 159)


                    
                    
            
</style>