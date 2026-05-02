---
note_type: other
categories:
  - "[[embedded]]"
tags:
  - conference
  - EWNA2025
created: 2026-04-04 22:54
modified: 2026-04-04
---
# Synchronization Techniques with Shared Memory

Presenter: Gary Davis Email: mailto:gdavis@ghs.com

<!--toc:start-->

- [Synchronization Techniques with Shared
  Memory](#synchronization-techniques-with-shared-memory)

  - [Difference between Multi-threading and
    Multi-processing](#difference-between-multi-threading-and-multi-processing)

    - [Multi-threading notes](#multi-threading-notes)

<!--toc:end-->

## Difference between Multi-threading and Multi-processing

#TODO add image of diagram here

- Multi-threading has the same shared memory for all threads

- Multi-processing in the other hand doesn’t. Each process has it’s own memory

  - This is considered a more safe model

  - Although synchronization is not as straightforward as with threads

### Multi-threading notes

- There’s no standard way to terminate threads in C/C++. Usually an exception is thrown
  to unwind the stack back to the thread entry point where the clean-up is handled

- Always catch exceptions that could be thrown by the thread and handle them + clean-up
  the thread

- Termination Foot-guns:

  - Thread is still active when the main program exits and the memory used by it
    persists causing memory leak

  - `exit()` or `terminate()` or similar functions as clean-up won’t be triggered

## Shared Memory Taxonomy

#TODO Add image of terms here

## Terms

- Function local variables (stack) - by default these are local to the thread (Not
  shared memory)

- Global - Shared memory.
  Can be accessed by any threads

- Dynamic memory - Shared memory.
  Can be accessed by it’s address by any thread

- Thread local - Global variables but a thread has its own local private copy of them.
  Could be shared memory by accident

**Read-write shared variables are the source of many problems but are also the benefit
of multi-threading (when compared to multi-processing)**

Simple example of a race condition.
Shared variables is `v` reader and writer have access to it and timing of the read and
write affects the behavior of the code below

```c
// server (reader)
if (v.job_id != 0 && (v.cksum & 0x8)) {
        search_for_life(v.job_id, v.cksum);
        v.job_id = 0;
}

...

//worker (writer)
{
    if (v.job_id != 0) continue;
    v.cksum = cksum;
    v.job_id = jobid;
    return
}
```

## Common techniques to mitigate race conditions

There’s no silver bullet but there’s different mechanism to address most of the issues

### Mutual Exclusion

- You can use `std::mutex` to lock/unlock a shared variable before reading and writing
  it.

- This needs to be done manually unfortunately.
  There’s no mechanism to enforce the use of a mutex when accesing a shared variable

- This can cause another problem: deadlocks.
  If the thread exits in the [[UV Tools and UV run commands|critical section]] of the program without
  unlocking the mutex it will deadlock the program

- `std::lock_guard` - Better way to do mutex.
  Uses RAII to create a context manager that handles the clean-up automatically when the
  guard goes out-of-scope mitigating the issue above

- Types of mutual exclusion primitives in C++ stdlib:

  - Mutex:

    - `recursive{_timed}_mutex` - Single ownership, nested

    - `timed_mutex` - single ownership, supports timed await

    - `shared{_timed}_mutex` - supports multiple reader ownership and access to a
      variable using `lock_shared`. Still only supports single writer.
      Writer calls the `lock` function same as the other mutexes

  - Lock guards:

    - `unique_lock_guard`

    - `scoped_lock_guard`

    - `shared_lock_guard`

### Mutual Exclusion Foot-guns:

- Re-locking a non-recursive mutex that the thread has locked

- Terminating a thread that owns a mutex - Undefined behavior

## Conditional Variables

Eliminates the timing and suspends a process until something can be done.
The waiter must:

- Hold the lock on a mutex

- Mutex/condition variable pairing must be consistent

- `cond_var.wait(unique_lock)` releases the lock and sleeps

- When awoken, the mutex is required before `wait()` returns.

Example (pre-condition variable)
```c

// Server-side
event wait_for_event(void) {
    while (true) {
        /* wait for an event to handle */
        std::lock_guard<std::mutex> lock(eventq_mutex);
        {
            if (!eventq.empty())
                return eventq.pop();
        }
    }
}

// Sensor-side
void enqueue(event a) {
    std::unique_lock_guard<std::mutex> lock(eventq_mutex);
    eventq.push(a)
}
```

Example (pre-condition variable)
```c

std::priority_queue<event> eventq;
std::mutex eventq_mutex
std::condition_variable event_cond; //added


// Server-side
event wait_for_event(void) {
    /* wait for an event to handle */
    std::unique_lock_guard<std::mutex> lock(eventq_mutex); //Changed to unique_lock_guard

    //Meat of the condition_variable waiting + locking
    while (eventq.empty()) {
        event_cond.wait(lock);
    }
    //OR can be written like this using lambdas
    event_cond.wait(lock, [] { return !eventq.empty(); });

    return eventq.pop();
}

// Sensor-side
void enqueue(event a) {
    std::unique_lock_guard<std::mutex> lock(eventq_mutex);
    eventq.push(a)
    event_cond.notify_one(); //added
}
```

Fixed size queue example:
```c

custom_fixed_size_queue<event> eventq;
std::mutex eventq_mutex
std::condition_variable writer_cond, reader_cond;


// Server-side
event wait_for_event(void) {
    /* wait for an event to handle */
    std::unique_lock_guard<std::mutex> lock(eventq_mutex);
    reader_cond.wait(lock, [] { return !eventq.empty(); });
    writer_cond.notify_one()
    return eventq.pop();
}

// Sensor-side
void enqueue(event a) {
    std::unique_lock_guard<std::mutex> lock(eventq_mutex);
    writer_cond.wait(lock, [] { return !eventq.full(); });
    eventq.push(a)
    reader_cond.notify_one();
}
```

## Future/Promises

What happens when you write to a promise more than once?
Undefined behavior?

```c
void do_one_task(workitem item){
    std::promise<workresult> promise
    std::future<workresult> future = promise.get_future()
    std::thread worker(do_work, std::move(item), promise);

    //OR
    std::future future = std::async(std::launch::async, dowork2, item)

    //do other things until we need the result
    ....

    workresult result = future.get()
    worker.join();
}

void do_work1(workitem item, promise){
    promise.set_value(compute(std::move(item)))
}


workresult do_work2(workitem item){
    return compute(std::move(item))
}
```

# Guidelines for writing efficient and reliable C/C++ code

Focused on coding techniques and standards that are largely software design and language
agnostic

Optimizing for the following:

- Reliability

- Portability

- Efficiency

## Simple Code Efficiencies

**Avoid truncation by using the right data type size**

- One extra instruction for the truncation operation

**Unsigned variables are slightly more efficient than the signed variables**

- You see the difference the most when doing division or modulus operations by a power
  of two

- Bit shift and shift masking also

**Loop Indices: Use `size_t`. Do not use small variables **

- Details [[Embedded World North America 2025|Loop Indices]]

**Alignment issues: make sure that data types are address and size aligned when doing
operations on them**

- Structure packing can cause misalignment.
  By default the compiler will always align a struct by adding padding

- `#pragma pack(1)` tells the compiler to not align a struct.

**Global/local data declaration ordering**

- Rule of thumb declare the variables where they are used.
  The closer to it the better (i.e use local variables instead of global, if global then
  declare it in the same file as where it is used)

- Use static declarations for globals whenever possible

- Use function-level static variables for:

  - Keeping a value live across invocations

  - To use permanent (.bss/.data) memory instead of memory from the stack

  - For const data (i.e `static const i[] = {2, 1, 3}`) - Otherwise the compiler will
    use a copy of the variable if there’s a recursive call.
    In C++ static is implied for const variables inside functions

- Avoid static variables for everything else.
  The compiler will have to store back the variable in memory before leaving the
  function every time

**Const**

- Helpful for globals.
  Reduces the instructions to load and access the variable

- Using const in function signatures doesn’t provide this optimization though.
  Compiler can’t guarantee constness of a variable within a function:
```c
int foo(const int *p){
    func(*p) //Compiler can't assume this function will also keep const
    return *p
}

int global;
//This is allowed
foo(&global)
```

**Restrict Keyword**

```c
void fir(const int *restrict in, const int *restrict coeff, int *restrict out)
```

This tells the compiler that `*out` will not modify `*in` Const does not improve code
efficiency if the `restrict` keyword

**Variable (in/output) parameters**

- For scalars pass by value

- Arrays/containers by pointer/reference

- For classes or structures it varies.
  The size of object determines what is best.
  Rule of thumb if var `> 2*sizeof(void*)` then use pointer/reference

**Declaration of scope variable**

```c
int arr[40];
float data[20]

if (cond){
    return data
}
else {
    return arr
}

//instead do
if (cond){
    float data[20]
    return data
}
else {
    int arr[40];
    return arr
}
```

#TODO Look at tail call optimization [Tail call -
StackOverflow](https://stackoverflow.com/questions/78979492/optimization-of-tail-recursion-in-r)
![tail_call_optimization](https://i.sstatic.net/v8mDSrro.png)

**Single-precision floating point arithmetic** Write single-precision floating constant
with `f` at the end . `float some_const = 3.0f`

## Memory Optimizations

Compiler can do the following:
```c
int memory;
memory  = 1; //Compiler will get rid of this (redundant access)
memory = 2 ;
```

This is not desired when reading a mapped IO register.
To turn it off use `volatile` keyword

Volatile is not recommended for shared memory:

- This works fine on single-core but doesn’t work on multi-core

- Volatile doesn’t guarantee safe access on multi-core

## Reliability foot-guns

### Violation of C aliasing

C and C++ have rules about aliasing from one type to another Bad example:
```c
float negate_float(float* p){
    *(uint32_t *)p ^= 0x80000000;
    return *p;
}
```

Do:

- Use the right type

- Use memory barriers that tell the compiler that memory will change (implementation
  specific)

  - Use `std::bitcast` for example

  - `memcpy` works in c

### Inline assembly

Dont:

- write inline assembly code in a function

Do:

- Creating a function that encapsulates the assembly code

- Define all the assembly function in one header file

- Macro-guard the assembly implementations by compiler (GNU, Clang) and architecture

- Use CMSIS for cross-compiler assembly.
  ARM CMSIS is a good example

Example of CMSIS:
```c
cnt = __CLZ(bits) //Count number of zeros
rword = __REV(word) //Swap endianness
__enable_irq()
```

### Datatype selection

In C/C++, types do not have a guaranteed size

- `char` - must be at least 8 bits but can be larger

- `short` - Expected 16-bit but can be larger

- `int` - usually 32-bit but can be 16-bit in some architectures or larger

### C99 stdint.h

Three variants of length-specific types:

- Exact length: `int16_t`

- Smallest type of at least a given length: `int_least16_t`

- Most efficient type of at least a given length: `int_fast_16_t`

Additionally there’s `(u)nitptr_t`for pointer arithmetic

### Portability

```c
extern int32_t arr[64]
int j;
for (j = 0; j < 64; j++){
    if (arr[j] > j*1024) { //This could cause an integer overflow in architecures that `int` is not 32-bit
        arr[j] = 0;
    }
}

head_loc *compare(head_loc *a, head_loc *b){
        offset_typ t1 = a->off;
        offset_typ t2 = b->off
        t1 += a->sector << OFF_BITS;
        t2 += b->sector << OFF_BITS;
        return (t1 > t2) ? a : b
}
```

### Loop indices

```c

int16_t i;
for (i=b; i<e; i++){
    p[i] = 0;
}


//Compiler would like to recode the code above in this efficient manner:
data_t *t = &(p[b])
for (i=b; i<e;i++){
    *(t++) = 0;
}

// But this doesn't work if the i variable is an int16_t and can wrap around due to safety
```

### Alignment and Packed structs

```c
#pragma pack(1)
struct f {
    uint8_t a;
    uint32_t b;
} data[NUM_ELEMENTS];

//This will cause misaligned access if you feed struct f
uint32_t dmx(uint32_t** ptr) {
    *ptr = &(data[index+1].b)

}
//Must use void ptr
uint32_t ld_mis_32(void** ptr)

//Or use special __packed_ptr type

//Misaligned pointer issue: #TODO expand on this example with the slides
uintptr_t first_three(uintptr_t *p) {
        return p[0] + p[1] + p[2]
    }

    ldp x2, x3, [x0]
    ldr x4, x3, [x0]
    add x5, x2, x3
```

# Day1 to Day2

---
note_type: fleeting
conference: EmbeddedWorld2025NA
categories:
  - "[[Events]]"
type: "[[Conferences]]"
tags:
  - conference 
  - EWNA2025
---
# Talks

<!--toc:start-->

- [Talks](#talks)

  - [Highlights:](#highlights)

  - [Zephyr RTOS Functional Safety](#zephyr-rtos-functional-safety)

  - [Multi-threading trade-offs:](#multi-threading-trade-offs)

  - [Zephyr Specific Advice](#zephyr-specific-advice)

  - [OTA in Zephyr Tools](#ota-in-zephyr-tools)

    - [Scaling beyound one device](#scaling-beyound-one-device)

  - [Formal methods for runtime fault detection in C/C++ and
    Rust](#formal-methods-for-runtime-fault-detection-in-cc-and-rust)

    - [Most common runtime faults:](#most-common-runtime-faults)

    - [Rust as ‘memory-safe’ language](#rust-as-memory-safe-language)

  - [Contributing to Zephyr:](#contributing-to-zephyr)

    - [How to write a new driver](#how-to-write-a-new-driver)

<!--toc:end-->

## Highlights:

- Keynote on navigating complexity: [[navigating-complexity-keynote]]

- Contributions to Zephyr talk

## Zephyr RTOS Functional Safety

Common requirements for threads

- Thread control block

  - Contains the thread stack pointer

  - The stack allocated for the thread

  - Entry point for the thread

- SystemTick

- Timer thread

- Interrupt Handling

- Idle Thread

## Multi-threading trade-offs:

Pros:

- Efficient use of resources

- Scalable architecture Cons:

- If not done correctly, multithreaded systems can face the following:

  - Race coditions

  - Data corruption of shared resources

- Not your code so debuging is harder

## Zephyr Specific Advice

- Use static thread creation.
  Use the `K_THREAD_DEFINE` macro always

- Use preemptive over cooperative scheduling for threads -

- Zephyr not pre-certified for safety-critical applications.
  Needs to be paired up with a safety-critical ecosystem to be qualified

## OTA in Zephyr Tools

MCUMgr:

- Native and simple

- Perfect for bring-up

- Reliable transport

UpdateHub:

- Lightweight CoAp-based

- Works with MCUboot for signed images and rollback

- Offer cloud/self-hosted backend for monitoring deployments

Hawkbit:

- OTA management server for large device fleets

- Zephyr include HawkBit client susbsystem

- Handler artificact hosting, rollout orchestration and device targetting via REST or
  MQTT

Meander:

- End-to-end OTA solution (client and management server)

- MCUboot for secure image validation and rollback

- Flexible state machine to handle every update stage

- Unified ecosystem between Linux and MCUs

Golioth:

- Use CoAP over DTLS

- Built on top of MCUboot

### Scaling beyound one device

- Manager device inventory and variants, use groups and tags for targetting deployment

- Perform phased rollouts

- Monitor rollout metrics and failure

- Mantain an auditable log

- MCUmgr is an excellent start but doesn’t scale alone

- Start simple, but design rollback from day one

- Security and fleet managements are must-haves

- Borrow ideas from the Linux community in OTA

## Formal methods for runtime fault detection in C/C++ and Rust

### Most common runtime faults:

- Buffer overflow/out-of-bound access

- Signed integer overflow

- Floating point variables can become -+NaN

- Memory leak and heap exhaustion

### Rust as ‘memory-safe’ language

- Rust uses smart pointer for access to the heap and is proven to being able to get rid
  of a lot of the runtime faults

- Unsafe keywords gets rid of the protection that the above provides

- In normal safe Rust one can still hit runtime faults.
  For example out-of-bounds access aren’t caught by the compiler

Formal methods - what is it?
Using mathematics to explore the whole range of possibilities for inputs of your program
to simulate and calculate the outputs and get a plane of the state of the program
focusing on the error/edge case states

- No false negatives. Mathematically proven.

## Contributing to Zephyr:

[Reference PR](https://github.com/zephyrproject-rtos/zephyr/pull/93021)

Zephyr is currently in a goldilocks zone where it is not too big nor too small (looking
at commit number graph Zephyr stands at around 100k)

### How to write a new driver

- Identify the subsystem that driver belongs too

- Look at drivers in that subsystem as a reference

- Whatever the most similar driver there is, start with that and update to the device’s
  datasheet


---
