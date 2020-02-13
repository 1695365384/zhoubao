<template>
  <div>
<!--    这是我的表格-->
<!--    {{row}}-->

    <List item-layout="vertical">
      <ListItem :key="capNumber(rowIndex+1)+'.'+title.target" v-for="(title,rowIndex) in  row">
         <ListItemMeta :title="capNumber(rowIndex+1)+'.'+title.target" />
        <p  v-for='(text,index) in title.Major' :key="text.content" >{{(index+1)+'.' + text.content}}</p>
      </ListItem>
    </List>
  </div>
</template>

<script>
    export default {
        name: "tabTemplate",
        props: {
            row: Array
        },
        computed:{

        },
        methods:{
            capNumber(value) {
                if (!value) return ''
                switch (value) {
                    case 1:
                        return "一、";
                    case 2:
                        return "二、";
                    case 3:
                        return "三、";
                    case 4:
                        return "四、";
                    case 5:
                        return "五、";
                    default :
                        return ''
                }

            }
        },

        filters: {
            capNumber(value) {
                if (!value) return ''
                switch (value) {
                    case 1:
                        return "一、";
                    case 2:
                        return "二、";
                    case 3:
                        return "三、";
                    case 4:
                        return "四、";
                    case 5:
                        return "五、";
                    default :
                        return ''
                }
            }
        }
    }
</script>

<style scoped>

</style>
