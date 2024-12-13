
class Queue {
  constructor() {
    const size = parseInt(process.env.data_SIZE, 10) || 20;
    this.arr = new Array(size);
    this.front = -1;
    this.rear = -1;
    this.size = 0;
    this.capacity = size;
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }

  enqueue(data) {
    if (this.isFull()) {
      console.log("Queue is full. Cannot add data.");
      return false;
    }
  
    const { date, time } = data;
  
    if (this.isEmpty()) {
      console.log("Adding to an empty queue");
      this.front = this.rear = 0;
      this.arr[this.rear] = data;
    } else {
      let i = this.rear;
      while (i !== this.front - 1 && i >= 0) {
        const current = this.arr[i];
          if (
          current &&
          (current.date < date ||
            (current.date === date && current.time <= time))
        ) {
          this.arr[(i + 1) % this.capacity] = current;
        } else {
          break;
        }
  
        // Move backward in a circular manner
        i = (i - 1 + this.capacity) % this.capacity;
      }
  
      // Insert the new appointment in its correct position
      this.arr[(i + 1) % this.capacity] = data;
  
      // Update the rear pointer
      this.rear = (this.rear + 1) % this.capacity;
    }
  
    this.size++;
    return true; // Indicate success
  }

  getQueue() {
    let newArr = []; // Initialize newArr as an empty array
    let index = 0;
  
    if (this.front <= this.rear) {
      // Case when the queue has not wrapped around
      for (let i = this.front; i <= this.rear; i++) {
        newArr[index] = this.arr[i];
        index++;
      }
    } else {
      // Case when the queue has wrapped around
      for (let i = this.front; i < this.capacity; i++) {
        newArr[index] = this.arr[i];
        index++;
      }
      for (let i = 0; i <= this.rear; i++) {
        newArr[index] = this.arr[i];
        index++;
      }
    }
  
    return newArr;
  }
  
  

  // Remove an data from the queue
  dequeue(data) {
    if (this.isEmpty()) {
      console.log("Queue is empty! Nothing to dequeue.");
      return null;
    }
  
    const { date, day, time, doctorId } = data;
    let found = false;
    let val = null;
  
    for (let i = 0; i < this.size; i++) {
      const index = (this.front + i) % this.capacity; // Adjust for circular queue
      if (
        this.arr[index].doctorId === doctorId &&
        this.arr[index].date === date &&
        this.arr[index].time === time &&
        this.arr[index].day === day
      ) {
        val = this.arr[index];
        found = true;
  
        // Shift elements to fill the gap
        for (let j = index; j !== this.rear; j = (j + 1) % this.capacity) {
          const nextIndex = (j + 1) % this.capacity;
          this.arr[j] = this.arr[nextIndex];
        }
  
        this.rear = (this.rear - 1 + this.capacity) % this.capacity;
        this.arr[this.rear] = undefined; 
        break;
      }
    }
  
    if (!found) {
      console.log("Appointment not found in the queue.");
      return null;
    }
  
    this.size--;
    return val;
  }
  

  // Peek at the front of the queue without removing it
  peek() {
    return this.isEmpty() ? null : this.arr[this.front];
  }

  
}

export default Queue;
