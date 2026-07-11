---
title: Processes & Threads
description: The units of execution — what they are, how they differ, and when to use which.
order: 1
tags: [os]
---

A **process** is a running program: its own virtual address space, file descriptors, and at least one thread. A **thread** is an execution stream *inside* a process: its own stack, registers, and program counter — but sharing the process's heap, globals, and open files with its sibling threads.

| | Process | Thread |
| --- | --- | --- |
| Memory | Isolated address space | Shared with siblings (own stack) |
| Creation cost | Heavy (new address space) | Light |
| Context switch | Expensive (page tables, TLB flush) | Cheaper (same address space) |
| Failure isolation | One crash ≠ others crash | One bad thread can corrupt/kill all |
| Communication | IPC: pipes, sockets, shared memory | Just read/write shared memory (+ locks) |

**Context switching**: the kernel saves one execution context (registers, PC, stack pointer) and restores another. Process switches also swap the address space — flushing the TLB is what makes them costlier. Frequent switching burns CPU on bookkeeping ("thrashing the scheduler").

**Concurrency vs parallelism**: concurrency is *structuring* work as independently progressing tasks (even on one core, interleaved); parallelism is *executing* simultaneously on multiple cores. Threads give you both; async I/O gives concurrency without threads.

**When to choose what**: processes for isolation (browser tabs, CGI workers — a crash is contained); threads for cheap data sharing (web server request handlers); async/event loop for huge numbers of I/O-bound tasks (Node, nginx). CPU-bound work needs real cores — threads (or processes for languages with a GIL like CPython).

## Interview Q&A

**Q: What's actually in a PCB (process control block)?**
A: The kernel's record of a process: PID, state, saved registers/PC, page-table pointer, open file table, scheduling info, credentials. It's what makes a context switch resumable.

**Q: Why is a thread context switch cheaper than a process switch?**
A: Same address space — no page-table swap, no TLB flush. Only registers/stack pointer change. The TLB flush is the dominant hidden cost of process switches.

**Q: A program is slow and CPU-bound. Threads or async?**
A: Threads/processes across cores — async only helps when tasks *wait* (I/O). In CPython specifically, the GIL forces multiprocessing for CPU-bound parallelism.

**Q: What happens on `fork()`? Why is it fast even for a huge process?**
A: The child gets a logically complete copy of the parent's address space — implemented as **copy-on-write**: pages are shared read-only until either side writes, so nothing is copied up front.

**Q: User-level vs kernel-level threads?**
A: Kernel threads are scheduled by the OS (true parallelism, syscall cost). User/green threads are scheduled by a runtime in userspace (cheap, but one blocking syscall can stall all of them unless the runtime intercepts it — how Go's scheduler and async runtimes earn their keep).
