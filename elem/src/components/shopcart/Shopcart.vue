<template>
    <div id="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{highlight: totalCount > 0}">
                        <i class="icon-shopping_cart"></i>
                    </div>
                    <div class="num" v-show="totalCount>0"> {{ totalCount }} </div>
                </div>
                <div class="price" :class="{highlight: totalPrice > 0}"> ￥{{ totalPrice }}</div>
                <div class="desc"> 配送费￥{{ deliveryPrice }}元 </div>
            </div>
            <div class="content-right" :class=" {end: totalPrice >= minPrice} " @click.stop="pay">
                <div class="pay"> {{ payDesc }} </div>
            </div>
        </div>
        <div class="ball-container">
            <transition name = "drop" v-for="ball in balls" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
                <div class="ball"  v-show="ball.show" >
                    <div class="inner"></div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="clear">清空</span>
                </div>
                <div class="list-content" ref="foodScroll">
                    <ul>
                        <li v-for="food in selectedFoods" class="food border-1px" >
                            <span class="name"> {{ food.name }} </span>
                            <div class="price">
                                <span> ￥{{ food.price * food.count }} </span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <transition name="show">
            <div class="list-mask" v-show="listShow" @click="toggleList"></div>
        </transition>
    </div>
</template>
<script>
    import BScroll from 'better-scroll';
    import cartcontrol from '../../components/cartcontrol/cartcontrol'
    export default {
        name:'shopcart',
        data() {
           return {
               balls: [
                   {
                       show: false
                   },
                   {
                       show: false
                   },
                   {
                       show: false
                   },
                   {
                       show: false
                   },
                   {
                       show: false
                   }
               ],
               dropBalls: [],
               fold: true
           }
        },
        props: {
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            },
            selectedFoods: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        components: {
            cartcontrol
        },
       
        methods: {
         
            drop(el ) {

               for(let i=0; i< this.balls.length; i++) {
                   let ball = this.balls[i];
                   if(!ball.show) {
                       ball.show = true;
                       ball.el = el;
                       this.dropBalls.push(ball);
                       return;
                   }
               }
           
            },
            toggleList() {
               if(!this.totalCount) {
                   return;
               }
               this.fold = !this.fold;
            },
            clear() {
                this.selectedFoods.forEach(function(food) {
                    food.count = 0;
                });
            },
            pay() {
                if(this.totalPrice < this.minPrice) {
                    return
                }
                else {
                    window.alert(`支付${this.totalPrice}元`)
                }
            },
            beforeEnter (el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();
                        let left = rect.left - 32;
                        let top = -(window.innerHeight - rect.top - 22);
                        el.style.display = '';

                        el.style.webkitTransform = `translate3d(0,${top}px,0)`;
                        el.style.transform = `translate3d(0,${top}px,0)`;
                        let inner = el.getElementsByClassName('inner')[0];
                     
                        inner.style.webkitTransform = `translate3d( ${left}px,0,0)`;
                        inner.style.transform = `translate3d(${left}px,0,0)`;
                    }
                }
            },
            enter (el, done) {
                /* eslint-disable no-unused-vars */
                let refresh = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                });
                done();
            },
            afterEnter (el) {
                let ball = this.dropBalls.shift();
                if(ball) {
                    ball.show =  false;
                }
                // el.style.display = 'none';
            }
        },
        computed: {
            totalPrice: function() {
                let total = 0;
                this.selectedFoods.forEach(function(food) {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount: function() {
                let total = 0;
                this.selectedFoods.forEach(function(food) {
                    total+= food.count;
                });
                return total;
            },
            payDesc: function() {
                if(this.totalPrice === 0) {
                    return this.minPrice + '起送';
                }
                if(this.totalPrice >= this.minPrice) {
                    return '去结算';
                } 
                let diff = (this.minPrice-this.totalPrice)
                return '还差￥'+ diff + '可配送';
            },
            listShow: function() {
                if(!this.totalCount) {
                    this.fold = true;
                } 
                let show = !this.fold;
                if(show) {
                    if(!this.scroll) {
                        this.$nextTick(()=> {
                        this.scroll = new BScroll(this.$refs.foodScroll, {click:true}); 
                        })
                    } else {
                        this.scroll.refresh();
                    }
                };
                return show;
            }
        }
        
    }
</script>
<style lang="stylus">
@import "../../common/stylus/mixin.styl"
    #shopcart
        position:fixed
        left: 0
        bottom: 0
        z-index: 2
        width: 100%
        height: 48px
        .content
            display: flex
            background-color: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex:1
                .logo-wrapper
                    display: inline-block
                    position: relative
                    top: -10px
                    padding: 6px
                    margin: 0 12px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        background: #2b343c
                        text-align: center
                        &.highlight
                            background: rgb(0, 160, 220)
                            .icon-shopping_cart
                                color:#fff
                        .icon-shopping_cart
                            font-size: 24px
                            line-height: 44px
                            color: #80858a
                           
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
                .price
                    display: inline-block
                    vertical-align:  top
                    line-height: 24px
                    margin: 12px 0 0 0 
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff

                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
                    font-weight: 200

            .content-right
                flex: 0 0 105px
                width: 105px
                background-color: #2b333b
                &.end
                    background-color: green
                    color: #fff
                .pay
                    font-size: 12px
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-weight: 700
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                transition: all 0.4s  cubic-bezier(0.49, -0.29,0.75,0.51)
            
                .inner  
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    background: rgb(0, 160, 220)
                    transition: all 0.4s linear
        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index:-1
            width: 100%
            transform: translate3d(0, -100%, 0)
            &.fade-enter-active, &.fade-leave-active
                transition: all 0.5s       
            &.fade-enter, &.fade-leave-active
                transform: translate3d(0, 0, 0)
            .list-header
                padding: 0 18px
                height: 40px
                line-height: 40px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    margin: 0
                    float:left
                    font-size: 14px
                    color: rgb(2, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0;
                        top: 12px 
        .list-mask
            position: fixed
            top: 0 
            left: 0
            width: 100%
            height: 100%;
            z-index: -2
            backdrop-filter: blur(10px)
            background-color: rgba(7, 17, 27, 0.6)
            &.show-enter-active, &.show-leave-active
                transition: all 0.5s
            &.show-enter, &.show-leave-active
                opacity: 0
</style>