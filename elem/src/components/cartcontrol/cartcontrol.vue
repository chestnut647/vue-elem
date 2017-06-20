<template>
    <div id="cartcontrol">
        <transition name="move">
            <div class="cart-decrease icon-remove_circle_outline" 
                v-show="food.count > 0" @click.stop="decreaseCart($event)"> 
            </div>
        </transition>
        <div class="cart-count" v-show="food.count"> {{ food.count }} </div>
        <div class="cart-increase icon-add_circle" @click.stop=" addCart($event) "></div>
        
    </div>
</template>
<script>
    import Vue from 'vue';
    export default {
        name: 'cartcontrol',
        props: {
            food: {
                type: Object
            }
        },
        methods: {
            addCart(event) {
                if(!event._constructed) {
                    return;
                }
                
                if( !this.food.count) {
                    Vue.set(this.food, 'count', 1);
                  
                } else {
                  
                    this.food.count ++;
                }
                this.$emit('add', event.target);
    
            },
            decreaseCart(event) {
                if(!event._constructed) {
                    return;
                }
                if(this.food.count) {
                    this.food.count--;
                }

            }
        },

    }
</script>
<style lang="stylus">
    #cartcontrol
        font-size: 0  
        .cart-decrease, .cart-increase
            display: inline-block
            font-size: 24px
            line-height: 24px
            padding: 6px
            color: rgb(0, 160, 220)
            &.move-enter-active, &.move-leave-active 
                transition: all 0.3s linear
                
            &.move-enter, &.move-leave-active 
              opacity: 0
              transform: translate3d(24px, 0, 0) rotate(180deg)
        .cart-count
            display: inline-block
            vertical-align: top
            width : 12px
            padding-top:  6px
            line-height: 24px
            font-size: 10px
            text-align: center
            color: rgb(147, 153, 159)
       
            
</style>
