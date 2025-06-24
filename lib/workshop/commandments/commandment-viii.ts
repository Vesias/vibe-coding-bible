import { WorkshopData } from '../types'

export const commandmentVIII: WorkshopData = {
  id: 'viii',
  commandmentNumber: 'VIII',
  title: 'Skalierungsstufen',
  subtitle: 'Scaling Divine Applications',
  sacredSymbol: '⚡',
  description: 'Master the art of scaling applications from prototype to production. Learn performance optimization and architecture scaling with AI.',
  difficulty: 'Expert',
  totalXP: 400,
  estimatedTime: 100,
  sacredWisdom: '"Wahre Meisterschaft zeigt sich nicht im ersten Code, sondern wenn er unter Last nicht bricht..."',
  prerequisites: ['i', 'ii', 'iii', 'vi', 'vii'],
  learningObjectives: [
    'Verstehe Scaling Fundamentals und Patterns',
    'Implementiere Performance Optimization Strategien',
    'Meistere Database Scaling Techniques',
    'Entwickle Microservices Architecture',
    'Optimiere für High-Traffic Scenarios'
  ],
  lessons: [
    {
      id: 'scaling-fundamentals',
      title: 'Fundamentals of Application Scaling',
      content: `# Skalierungsstufen: Von Prototype zu Production

## Was bedeutet Scaling?

Scaling bedeutet, dass deine Anwendung von 10 Nutzern auf 10.000, 100.000 oder 1.000.000 Nutzer wachsen kann, ohne dass die Performance oder Verfügbarkeit leidet.

## Die Scaling-Pyramide

\`\`\`
           Production (1M+ users)
          /                      \\
     Performance              Availability
    (100K users)             (99.9% uptime)
    /          \\                 /         \\
Optimization  Caching     Load Balance  Redundancy
(10K users)   (sub-100ms)   (Multi-AZ)   (Failover)
/        \\        |           |            |
Code     DB    Browser    Application   Database
Quality  Indices  Cache      Servers     Replicas
(1K users - MVP baseline)
\`\`\`

## Die fünf Skalierungsstufen

### Stufe 1: MVP (1-1K Nutzer)
**Focus:** Funktionalität über Performance
- Single Server
- Monolithic Architecture
- SQL Database
- Basic Monitoring

**Scaling-Metriken:**
- Response Time: < 2 Sekunden
- Uptime: > 95%
- Development Speed: Highest Priority

### Stufe 2: Growth (1K-10K Nutzer)
**Focus:** Performance Optimization
- Database Indexing
- Query Optimization
- Basic Caching
- Error Monitoring

**Scaling-Metriken:**
- Response Time: < 1 Sekunde
- Uptime: > 99%
- Database Queries: < 100ms

### Stufe 3: Scale (10K-100K Nutzer)
**Focus:** Infrastructure Scaling
- Load Balancing
- Database Replication
- CDN Implementation
- Application Caching

**Scaling-Metriken:**
- Response Time: < 500ms
- Uptime: > 99.5%
- Concurrent Users: 1000+

### Stufe 4: Enterprise (100K-1M Nutzer)
**Focus:** Distributed Architecture
- Microservices
- Database Sharding
- Event-Driven Architecture
- Advanced Monitoring

**Scaling-Metriken:**
- Response Time: < 200ms
- Uptime: > 99.9%
- Requests/Second: 10K+

### Stufe 5: Hyperscale (1M+ Nutzer)
**Focus:** Global Distribution
- Multi-Region Deployment
- Edge Computing
- Advanced AI/ML Optimization
- Chaos Engineering

**Scaling-Metriken:**
- Response Time: < 100ms globally
- Uptime: > 99.99%
- Requests/Second: 100K+

## AI-Assisted Scaling Analysis

\`\`\`markdown
## SCALING ANALYSIS REQUEST

### Current Application State:
- Users: [CURRENT_USER_COUNT]
- Tech Stack: [TECHNOLOGIES]
- Architecture: [CURRENT_ARCHITECTURE]
- Performance: [CURRENT_METRICS]

### Growth Projection:
- Expected Users: [PROJECTED_GROWTH]
- Timeline: [GROWTH_TIMELINE]
- Geographic Distribution: [REGIONS]

### Current Bottlenecks:
- Database: [DB_PERFORMANCE_ISSUES]
- Application: [APP_PERFORMANCE_ISSUES]
- Network: [NETWORK_ISSUES]

### Business Constraints:
- Budget: [BUDGET_CONSTRAINTS]
- Timeline: [DEVELOPMENT_TIMELINE]
- Team Size: [TEAM_RESOURCES]

AI, please analyze and provide:
1. Scaling strategy roadmap
2. Priority-ordered optimizations
3. Technology recommendations
4. Cost-benefit analysis
5. Risk assessment
\`\`\`

## Performance Budgets

### Response Time Budget
\`\`\`
Target: 500ms total response time

Budget Allocation:
- DNS Lookup: 20ms
- Connection: 30ms
- Server Processing: 200ms
- Database Query: 100ms
- Network Transfer: 50ms
- Client Rendering: 100ms

Total: 500ms
\`\`\`

### Resource Budget
\`\`\`
Target: Support 10K concurrent users

Resource Allocation:
- CPU: 70% average utilization
- Memory: 80% average utilization
- Database Connections: 500 max
- Network Bandwidth: 1Gbps
- Storage IOPS: 10K IOPS
\`\`\``,
      type: 'theory',
      estimatedTime: 30,
      xp: 80
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization Strategies',
      content: `# Performance Optimization: Microseconds Matter

## The Performance Optimization Hierarchy

### 1. Algorithmic Optimization (Biggest Impact)
\`\`\`typescript
// Bad: O(n²) algorithm
function findDuplicates(arr: number[]): number[] {
  const duplicates: number[] = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i])
      }
    }
  }
  return duplicates
}

// Good: O(n) algorithm
function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>()
  const duplicates = new Set<number>()
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item)
    } else {
      seen.add(item)
    }
  }
  
  return Array.from(duplicates)
}
\`\`\`

### 2. Database Optimization
\`\`\`sql
-- Bad: No indexes, inefficient query
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC;

-- Good: Proper indexes and optimized query
-- Create indexes first:
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Optimized query with query hint
SELECT u.name, COALESCE(o.order_count, 0) as order_count
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  GROUP BY user_id
) o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
ORDER BY order_count DESC;
\`\`\`

### 3. Caching Strategies
\`\`\`typescript
class MultiLevelCache {
  private l1Cache = new Map<string, any>() // Memory cache
  private l2Cache: Redis // Distributed cache
  private l3Cache: Database // Persistent storage
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Check memory cache (fastest)
    if (this.l1Cache.has(key)) {
      return this.l1Cache.get(key)
    }
    
    // L2: Check Redis cache
    const l2Result = await this.l2Cache.get(key)
    if (l2Result) {
      // Populate L1 cache
      this.l1Cache.set(key, l2Result)
      return l2Result
    }
    
    // L3: Check database (slowest)
    const l3Result = await this.l3Cache.query(key)
    if (l3Result) {
      // Populate both L1 and L2 caches
      this.l1Cache.set(key, l3Result)
      await this.l2Cache.set(key, l3Result, 'EX', 3600) // 1 hour TTL
      return l3Result
    }
    
    return null
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    // Write to all cache levels
    this.l1Cache.set(key, value)
    await this.l2Cache.set(key, value, 'EX', ttl)
    await this.l3Cache.store(key, value)
  }
}
\`\`\`

## AI-Powered Performance Analysis

### 1. Performance Profiling with AI
\`\`\`markdown
Analysiere diese Performance-Daten und identifiziere Bottlenecks:

Performance Metrics:
- P50 Response Time: 800ms
- P95 Response Time: 2.1s
- P99 Response Time: 5.2s
- CPU Usage: 85% average
- Memory Usage: 92% peak
- Database Connections: 450/500

Slow Queries:
[QUERY_LOG_DATA]

Application Traces:
[DISTRIBUTED_TRACING_DATA]

Identifiziere:
1. Top 3 Performance Bottlenecks
2. Root Cause Analysis
3. Prioritized Optimization Plan
4. Expected Performance Gains
5. Implementation Effort Estimates
\`\`\`

### 2. Load Testing Strategy
\`\`\`typescript
// AI-Generated Load Testing Scenarios
interface LoadTestScenario {
  name: string
  users: number
  rampUp: number // seconds
  duration: number // seconds
  endpoints: Array<{
    path: string
    method: string
    weight: number // percentage of requests
    thinkTime: number // ms between requests
  }>
  acceptanceCriteria: {
    maxResponseTime: number
    maxErrorRate: number
    minThroughput: number
  }
}

const loadTestScenarios: LoadTestScenario[] = [
  {
    name: 'Normal Load',
    users: 1000,
    rampUp: 300,
    duration: 600,
    endpoints: [
      { path: '/api/users', method: 'GET', weight: 40, thinkTime: 1000 },
      { path: '/api/products', method: 'GET', weight: 30, thinkTime: 800 },
      { path: '/api/orders', method: 'POST', weight: 20, thinkTime: 2000 },
      { path: '/api/search', method: 'GET', weight: 10, thinkTime: 500 }
    ],
    acceptanceCriteria: {
      maxResponseTime: 500,
      maxErrorRate: 0.01,
      minThroughput: 100
    }
  },
  {
    name: 'Peak Load',
    users: 5000,
    rampUp: 600,
    duration: 1200,
    endpoints: [
      { path: '/api/users', method: 'GET', weight: 50, thinkTime: 500 },
      { path: '/api/products', method: 'GET', weight: 35, thinkTime: 400 },
      { path: '/api/orders', method: 'POST', weight: 10, thinkTime: 1500 },
      { path: '/api/search', method: 'GET', weight: 5, thinkTime: 300 }
    ],
    acceptanceCriteria: {
      maxResponseTime: 1000,
      maxErrorRate: 0.05,
      minThroughput: 400
    }
  }
]
\`\`\`

## Advanced Optimization Techniques

### 1. Connection Pooling
\`\`\`typescript
class OptimizedConnectionPool {
  private connections: Connection[] = []
  private available: Connection[] = []
  private pending: Array<{resolve: Function, reject: Function}> = []
  
  constructor(
    private config: {
      minConnections: number
      maxConnections: number
      acquireTimeout: number
      idleTimeout: number
    }
  ) {
    this.initialize()
  }
  
  async acquire(): Promise<Connection> {
    // Fast path: available connection
    if (this.available.length > 0) {
      return this.available.pop()!
    }
    
    // Medium path: can create new connection
    if (this.connections.length < this.config.maxConnections) {
      const connection = await this.createConnection()
      this.connections.push(connection)
      return connection
    }
    
    // Slow path: wait for available connection
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.pending.findIndex(p => p.resolve === resolve)
        if (index >= 0) {
          this.pending.splice(index, 1)
          reject(new Error('Connection acquire timeout'))
        }
      }, this.config.acquireTimeout)
      
      this.pending.push({
        resolve: (connection: Connection) => {
          clearTimeout(timeout)
          resolve(connection)
        },
        reject
      })
    })
  }
  
  release(connection: Connection): void {
    // Serve pending requests first
    if (this.pending.length > 0) {
      const { resolve } = this.pending.shift()!
      resolve(connection)
      return
    }
    
    // Return to available pool
    this.available.push(connection)
  }
}
\`\`\`

### 2. Memory Optimization
\`\`\`typescript
class MemoryEfficientDataProcessor {
  // Use generators for large datasets
  async* processLargeDataset(dataSource: AsyncIterable<DataItem>): AsyncGenerator<ProcessedItem> {
    const batchSize = 1000
    let batch: DataItem[] = []
    
    for await (const item of dataSource) {
      batch.push(item)
      
      if (batch.length >= batchSize) {
        // Process batch and yield results
        const processed = await this.processBatch(batch)
        for (const result of processed) {
          yield result
        }
        
        // Clear batch to free memory
        batch = []
        
        // Allow garbage collection
        if (global.gc) {
          global.gc()
        }
      }
    }
    
    // Process remaining items
    if (batch.length > 0) {
      const processed = await this.processBatch(batch)
      for (const result of processed) {
        yield result
      }
    }
  }
  
  // Object pooling for frequently created objects
  private objectPool = new Map<string, object[]>()
  
  borrowObject<T>(type: string, factory: () => T): T {
    const pool = this.objectPool.get(type) || []
    if (pool.length > 0) {
      return pool.pop() as T
    }
    return factory()
  }
  
  returnObject(type: string, object: object): void {
    const pool = this.objectPool.get(type) || []
    if (pool.length < 100) { // Max pool size
      // Reset object state
      Object.keys(object).forEach(key => {
        (object as any)[key] = undefined
      })
      pool.push(object)
      this.objectPool.set(type, pool)
    }
  }
}
\`\`\``,
      type: 'practice',
      estimatedTime: 40,
      xp: 100
    },
    {
      id: 'microservices-architecture',
      title: 'Microservices Architecture Patterns',
      content: `# Microservices: Breaking the Monolith

## Microservices Decomposition Strategy

### 1. Domain-Driven Design Approach
\`\`\`
Monolith Application
├── User Management
├── Product Catalog
├── Order Processing
├── Payment Processing
├── Inventory Management
└── Notification Service

Microservices Decomposition:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   User Service  │  │ Product Service │  │  Order Service  │
│                 │  │                 │  │                 │
│ - Authentication│  │ - Catalog Mgmt  │  │ - Order Mgmt    │
│ - User Profiles │  │ - Search        │  │ - Order Status  │
│ - Authorization │  │ - Recommendations│  │ - Order History │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Payment Service │  │Inventory Service│  │Notification Svc │
│                 │  │                 │  │                 │
│ - Payment Proc. │  │ - Stock Mgmt    │  │ - Email/SMS     │
│ - Billing       │  │ - Reservations  │  │ - Push Notifs   │
│ - Refunds       │  │ - Forecasting   │  │ - Event Tracking│
└─────────────────┘  └─────────────────┘  └─────────────────┘
\`\`\`

### 2. Service Communication Patterns
\`\`\`typescript
// 1. Synchronous Communication (HTTP/gRPC)
class UserService {
  async getUser(userId: string): Promise<User> {
    return await this.userRepository.findById(userId)
  }
}

class OrderService {
  constructor(private userService: UserService) {}
  
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // Synchronous call to User Service
    const user = await this.userService.getUser(orderData.userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Create order
    return await this.orderRepository.create({
      ...orderData,
      userEmail: user.email
    })
  }
}

// 2. Asynchronous Communication (Event-Driven)
interface DomainEvent {
  eventType: string
  aggregateId: string
  timestamp: Date
  data: any
}

class EventBus {
  private subscribers = new Map<string, Function[]>()
  
  subscribe(eventType: string, handler: Function): void {
    const handlers = this.subscribers.get(eventType) || []
    handlers.push(handler)
    this.subscribers.set(eventType, handlers)
  }
  
  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.subscribers.get(event.eventType) || []
    await Promise.all(handlers.map(handler => handler(event)))
  }
}

// Usage
class OrderService {
  constructor(private eventBus: EventBus) {}
  
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const order = await this.orderRepository.create(orderData)
    
    // Publish event instead of direct call
    await this.eventBus.publish({
      eventType: 'OrderCreated',
      aggregateId: order.id,
      timestamp: new Date(),
      data: {
        orderId: order.id,
        userId: order.userId,
        amount: order.total
      }
    })
    
    return order
  }
}

class InventoryService {
  constructor(eventBus: EventBus) {
    // Subscribe to order events
    eventBus.subscribe('OrderCreated', this.handleOrderCreated.bind(this))
  }
  
  private async handleOrderCreated(event: DomainEvent): Promise<void> {
    const { orderId, userId } = event.data
    await this.reserveInventory(orderId, userId)
  }
}
\`\`\`

### 3. Service Discovery and Load Balancing
\`\`\`typescript
interface ServiceInstance {
  id: string
  host: string
  port: number
  health: 'healthy' | 'unhealthy'
  metadata: Record<string, string>
}

class ServiceRegistry {
  private services = new Map<string, ServiceInstance[]>()
  
  register(serviceName: string, instance: ServiceInstance): void {
    const instances = this.services.get(serviceName) || []
    instances.push(instance)
    this.services.set(serviceName, instances)
  }
  
  discover(serviceName: string): ServiceInstance[] {
    return this.services.get(serviceName)?.filter(i => i.health === 'healthy') || []
  }
  
  healthCheck(): void {
    setInterval(async () => {
      for (const [serviceName, instances] of this.services.entries()) {
        for (const instance of instances) {
          try {
            const response = await fetch(\`http://\${instance.host}:\${instance.port}/health\`)
            instance.health = response.ok ? 'healthy' : 'unhealthy'
          } catch {
            instance.health = 'unhealthy'
          }
        }
      }
    }, 30000) // Check every 30 seconds
  }
}

class LoadBalancer {
  private roundRobinIndex = new Map<string, number>()
  
  getInstance(serviceName: string, instances: ServiceInstance[]): ServiceInstance | null {
    if (instances.length === 0) return null
    
    // Round-robin load balancing
    const currentIndex = this.roundRobinIndex.get(serviceName) || 0
    const instance = instances[currentIndex % instances.length]
    this.roundRobinIndex.set(serviceName, currentIndex + 1)
    
    return instance
  }
}
\`\`\`

## Advanced Scaling Patterns

### 1. CQRS (Command Query Responsibility Segregation)
\`\`\`typescript
// Command Side (Write Operations)
interface Command {
  execute(): Promise<void>
}

class CreateUserCommand implements Command {
  constructor(
    private userData: CreateUserRequest,
    private userRepository: UserWriteRepository
  ) {}
  
  async execute(): Promise<void> {
    const user = new User(this.userData)
    await this.userRepository.save(user)
    
    // Publish event for read model update
    await EventBus.publish(new UserCreatedEvent(user))
  }
}

// Query Side (Read Operations)
interface UserReadModel {
  id: string
  email: string
  displayName: string
  lastLogin: Date
  orderCount: number
  totalSpent: number
}

class UserQueryService {
  constructor(private readRepository: UserReadRepository) {}
  
  async getUserProfile(userId: string): Promise<UserReadModel> {
    return await this.readRepository.findUserProfile(userId)
  }
  
  async getUsersByActivity(limit: number): Promise<UserReadModel[]> {
    return await this.readRepository.findMostActiveUsers(limit)
  }
}

// Event Handler updates read model
class UserReadModelUpdater {
  constructor(eventBus: EventBus) {
    eventBus.subscribe('UserCreated', this.handleUserCreated.bind(this))
    eventBus.subscribe('OrderCreated', this.handleOrderCreated.bind(this))
  }
  
  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    const readModel: UserReadModel = {
      id: event.userId,
      email: event.email,
      displayName: event.displayName,
      lastLogin: new Date(),
      orderCount: 0,
      totalSpent: 0
    }
    
    await this.readRepository.createUserProfile(readModel)
  }
  
  private async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.readRepository.incrementUserStats(event.userId, {
      orderCount: 1,
      totalSpent: event.amount
    })
  }
}
\`\`\`

### 2. Event Sourcing
\`\`\`typescript
interface Event {
  eventId: string
  aggregateId: string
  eventType: string
  eventData: any
  timestamp: Date
  version: number
}

class EventStore {
  private events: Event[] = []
  
  async append(aggregateId: string, events: Event[]): Promise<void> {
    // Validate event sequence
    const lastVersion = await this.getLastVersion(aggregateId)
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      if (event.version !== lastVersion + i + 1) {
        throw new Error('Concurrency conflict')
      }
    }
    
    this.events.push(...events)
  }
  
  async getEvents(aggregateId: string, fromVersion?: number): Promise<Event[]> {
    return this.events.filter(e => 
      e.aggregateId === aggregateId && 
      (!fromVersion || e.version >= fromVersion)
    )
  }
  
  private async getLastVersion(aggregateId: string): Promise<number> {
    const events = await this.getEvents(aggregateId)
    return events.length > 0 ? Math.max(...events.map(e => e.version)) : 0
  }
}

class Aggregate {
  protected id: string
  protected version: number = 0
  protected uncommittedEvents: Event[] = []
  
  protected addEvent(eventType: string, eventData: any): void {
    const event: Event = {
      eventId: crypto.randomUUID(),
      aggregateId: this.id,
      eventType,
      eventData,
      timestamp: new Date(),
      version: this.version + 1
    }
    
    this.uncommittedEvents.push(event)
    this.apply(event)
  }
  
  protected abstract apply(event: Event): void
  
  getUncommittedEvents(): Event[] {
    return this.uncommittedEvents
  }
  
  markEventsAsCommitted(): void {
    this.uncommittedEvents = []
  }
}
\`\`\``,
      type: 'practice',
      estimatedTime: 45,
      xp: 120
    }
  ],
  exercises: [
    {
      id: 'performance-optimization-challenge',
      title: 'Performance Optimization Challenge',
      description: 'Optimiere eine langsame Anwendung systematisch von 2s auf unter 200ms Response Time',
      instructions: [
        'Analysiere die bereitgestellte langsame Anwendung',
        'Identifiziere alle Performance Bottlenecks',
        'Implementiere systematische Optimierungen',
        'Messe und dokumentiere Verbesserungen',
        'Führe Load Testing durch um Stabilität zu beweisen'
      ],
      expectedOutput: 'Optimierte Anwendung mit <200ms Response Time und umfassender Performance-Dokumentation',
      hints: [
        'Starte mit dem größten Bottleneck',
        'Messbare Metriken vor und nach jeder Optimierung',
        'Nutze AI für komplexe Algorithmus-Optimierungen'
      ],
      difficulty: 'hard',
      xp: 200,
      aiAssistance: true
    },
    {
      id: 'microservices-migration',
      title: 'Monolith zu Microservices Migration',
      description: 'Migriere systematisch einen Monolithen zu einer skalierbaren Microservices-Architektur',
      instructions: [
        'Analysiere den bestehenden Monolithen',
        'Plane die Microservices-Decomposition',
        'Implementiere Event-Driven Communication',
        'Baue Service Discovery und Load Balancing',
        'Teste die skalierte Architektur unter Last'
      ],
      expectedOutput: 'Funktionsfähige Microservices-Architektur mit nachgewiesener Skalierbarkeit',
      hints: [
        'Domain-Driven Design für Service-Grenzen',
        'Implementiere Monitoring und Observability',
        'Plane für Eventual Consistency'
      ],
      difficulty: 'hard',
      xp: 200,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'Performance Optimization demonstriert',
    'Microservices Architecture implementiert',
    'Load Testing erfolgreich durchgeführt',
    'Scaling Strategy dokumentiert',
    'Production-ready Deployment konfiguriert'
  ],
  nextCommandment: 'ix'
}