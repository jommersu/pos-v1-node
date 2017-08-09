const datbase = require('../main/datbase.js');
var loadAllItems = datbase.loadAllItems();
var loadPromotions = datbase.loadPromotions();
module.exports = function main(inputs) {
    let ListItems = countItems(inputs, loadAllItems);
    //console.log(ListItems);
    let PromotionItems = countPromotions(ListItems, loadPromotions);
    //console.log(PromotionItems);
    let allPrice = sumPrice(ListItems, PromotionItems);
    let sum = sumAndPro(allPrice , PromotionItems);
   // console.log(allPrice);
   // console.log(sum);
    let resultStirng = print(allPrice , PromotionItems , sum);
    console.log(resultStirng);

    return resultStirng;
};
function print(allPrice, PromotionItems , sum) {
    let printString = "***<没钱赚商店>购物清单***\n";
    for(let item of allPrice){
        printString += "名称：" + item.name+"，数量："+item.count+item.unit+"，单价："+(item.price).toFixed(2)+"(元)"+"，小计："+(item.sum).toFixed(2)+"(元)"+"\n";
    }
    printString += "----------------------\n";
    printString +="挥泪赠送商品：\n";
    for(let item of PromotionItems){
        printString += "名称："+item.name + "，数量："+item.proCount+item.unit+"\n";
    }
    printString += "----------------------\n";
    printString +=  "总计：" + (sum.Sum).toFixed(2) + "(元)"+"\n";
    printString +=  "节省：" + (sum.Pro).toFixed(2) + "(元)"+"\n"
    printString += "**********************";
    return printString;
}
function sumAndPro(allPrice , PromotionItems) {
    let result = {};//{Sum: 51, Pro:7.5}
    let Sum = 0;
    let Pro = 0;
    for(let item of allPrice){
        Sum += item.sum;
    }
    for(let item of PromotionItems){
        Pro += item.proCount * item.price;
    }
    result = {Sum , Pro};

    return result;
}
function sumPrice(ListItems , PromotionItems) {
    let result = [];
    let flag = 0;
    for(let item of ListItems){
        let newObj = item;
        newObj.sum = item.price * item.count;
        result.push(newObj);
        for(let proItme of PromotionItems){
            if(item.barcode === proItme.barcode){
                newObj.sum = item.price * (item.count - item.proCount);
            }
        }
    }
    return result;
}


function countPromotions(ListItems, loadPromotions) {
    let result = [];//{
    let proBarcodes = loadPromotions[0].barcodes;
    for(let item of ListItems) {
        for (let ProItem of proBarcodes) {
            if (item.barcode === ProItem) {
                if (item.count >= 2) {
                    let newobj = item;
                    item.proCount = 1;
                    result.push(newobj);
                } else {
                    let newobj = item;
                    item.proCount = 0;
                    result.push(newobj);
                }
            }
        }
    }
    return result;
}
function countItems(inputs , AllItems){
    let ListItems = [];
    /*
            barcode: 'ITEM000005',
            name: ' 可口可乐',
            unit: ' 瓶',
            price: 3.00
            count:count
        }
    */
    let result = []; // {key : Item000, count: count}
    let flag = 0;
    for(let item of inputs){
        for(let ObjItem of result){
            if(ObjItem.key === item){
                ObjItem.count ++;
                flag ++;
            }else{
                flag = 0;
            }
        }
        if(flag === 0){
            if(item.includes("-")){
                let arr = item.split("-");
                let obj = {key:arr[0], count : arr[1]};
                result.push(obj);
            }else{
                let obj = {key:item , count :　1};
                result.push(obj);
            }
        }
    }
    //console.log(result);
    for(let item of loadAllItems){
        for(let objItem of result ){
            if(objItem.key === item.barcode){
                let  newobj = item;
                newobj.count = objItem.count;
                ListItems.push(newobj);
            }
        }

    }
    //console.log(ListItems);
    return ListItems;
}