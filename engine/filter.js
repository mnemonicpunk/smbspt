export default class Filter {
    constructor(list) {
        this.list = list;
    }
    filter(func) {
        let new_list = [];
        for (let i=0; i<this.list.length; i++) {
            let item = this.list[i];
            if (func(item)) {
                new_list.push(item);
            }
        }
        return new Filter(new_list);
    }
    with(func) {
        for (let i=0; i<this.list.length;i++) {
            func(this.list[i]);
        }
    }
    byClass(class_name) {
        return this.filter(item => {
            return (item instanceof class_name);
        });
    }
    withClass(class_name, func) {
        this.byClass(class_name).with(func);
    }
}