# Practical 9: In-Memory Caching and Query Optimization

## Objective
Implemented server-side caching using 
ode-cache to measure its impact on API response time for the Task Management backend.

## Response Time Comparison

| Request Type | Cache Status | Response Time (ms) |
|--------------|--------------|--------------------|
| GET /tasks   | Miss (Uncached) | 18.35 ms           |
| GET /tasks   | Hit (Cached)  | 5.53 ms            |
| GET /tasks   | Hit (Cached)  | 4.16 ms            |
| GET /tasks   | Hit (Cached)  | 4.17 ms            |

*Note: Data was captured locally. Uncached request includes a MongoDB read operation. Cached requests return data directly from server memory.*

## Key Observations
- **Performance Improvement:** The API response time improved drastically from ~18ms to ~4-5ms, representing a significant reduction in latency.
- **Cache Invalidation:** The cache is explicitly invalidated (cache.del) on any write operation (POST, PUT, DELETE). Without this, the server would serve stale data to users until the 60-second TTL expires.
- **TTL (Time-To-Live):** Set to 60 seconds. A shorter TTL means less stale data but more frequent database reads. A longer TTL provides better performance but risks data staleness if not manually invalidated properly.
- **Limitation:** 
ode-cache is in-memory and local to the Node.js process. It would not work effectively in a multi-server (load-balanced) deployment, as each instance would maintain its own separate cache. A centralized store like Redis is required for distributed systems.
