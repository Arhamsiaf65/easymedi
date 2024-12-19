class Node {
    constructor(data, next) {
        this.data = data;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;  
    }

    isEmpty = () => {
        return this.head === null;
    }

    addAtStart = (data)=> {
        if(this.head == null){
            let newNode = new Node(data, null);
            this.head = newNode;
        }
        else{
            let newNode = new Node(data, this.head);
            this.head = newNode;    
        }
        
    }

    toArray() {
        const array = [];
        let current = this.head;
        while (current) {
          array.push(current.data); // Push the node's data to the array
          current = current.next;
        }
        return array;
    }

    removeFromStart(){
        this.head = this.head.next;
    }

    removeFromEnd() {
        if (!this.head) {
            console.log("The list is empty.");
            return -1;
        }

        if (!this.head.next) {
            const data = this.head.data;
            this.head = null;
            return data;
        }

        let current = this.head;
        let prev = null;

        while (current.next !== null) {
            prev = current;
            current = current.next;
        }

        const data = current.data;
        prev.next = null; 
        return data;
    }

    remove(key) {
        if (!this.head) {
            console.log("The list is empty.");
            return -1;
        }
    
        let headCopy = this.head;
        let prev = null;
    
        // Check if the head node has the key to remove it
        if (headCopy.data.id === key) {
            const val = headCopy.data.id;
            this.head = headCopy.next; // Update this.head to the next node
            return val;
        }
    
        // Traverse the list to find the node with the given key
        while (headCopy !== null && headCopy.data.id !== key) {
            prev = headCopy;
            headCopy = headCopy.next;
        }
    
        // If the node was found, remove it
        if (headCopy !== null) {
            prev.next = headCopy.next;
            return headCopy.data.id;
        } else {
            console.log("The record with this Id not found.");
            return -1;
        }
    }
    
    firstElement(){
        return this.head.data;
    }

    lastElement(){
        let tempHead = this.head;
        while(tempHead.next != null){
            tempHead = tempHead.next;
        }
        return tempHead.data;
    }

    print(){
        let headCopy = this.head;
        while(headCopy != null){
            console.log(headCopy.data.doctorName);
            console.log(headCopy.data.id);
            headCopy = headCopy.next;
        }
    }
}


 
export default LinkedList