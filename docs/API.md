# Wallflower API Documentation

## WebSocket Events

### Mobile Client → Backend

#### `mobile:plant_flower`

Plant a new flower in the garden.

**Payload:**
```typescript
{
  flowerType: 'rose' | 'tulip' | 'daisy' | 'sunflower' | 'lily' | 'poppy';
  color: { r: number; g: number; b: number }; // 0-255
  leaves: 'simple' | 'compound' | 'minimal';
  petalCount: number; // 5-12
}
```

**Response Events:**
- `mobile:plant_success` - Flower planted successfully
- `mobile:plant_error` - Error occurred (rate limit, validation, etc.)

### Backend → Mobile Client

#### `mobile:plant_success`

Flower was successfully planted.

**Payload:**
```typescript
{
  flowerId: string; // UUID
}
```

#### `mobile:plant_error`

Error occurred while planting.

**Payload:**
```typescript
{
  message: string;
}
```

**Common error messages:**
- "Please wait N seconds before planting another flower." (rate limit)
- "Invalid flower data. Please try again." (validation failed)
- "The garden is full! Please try again later." (max flowers reached)
- "Could not find a spot for your flower." (placement failed)

### Display Client → Backend

#### `display:ready`

Display client is ready and requesting initial garden state.

**Payload:**
```typescript
{
  displayId: string;
  bounds: {
    width: number;
    height: number;
  };
}
```

#### `display:request_sync`

Request manual resync of all flowers (for recovery).

**No payload**

### Backend → Display Client

#### `display:initial_state`

Initial garden state sent on connection or sync.

**Payload:**
```typescript
{
  flowers: Array<{
    id: string;
    flowerType: string;
    color: { r: number; g: number; b: number };
    leaves: string;
    petalCount: number;
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    plantedAt: Date;
  }>;
}
```

#### `display:flower_planted`

New flower was just planted (broadcast to all displays).

**Payload:**
```typescript
{
  id: string;
  flowerType: string;
  color: { r: number; g: number; b: number };
  leaves: string;
  petalCount: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  plantedAt: Date;
}
```

#### `display:sync_complete`

Manual sync completed successfully.

**No payload**

### Connection Events

#### `connection_established`

Sent to all clients after successful connection.

**Payload:**
```typescript
{
  clientType: 'mobile' | 'display';
}
```

## REST Endpoints

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### `GET /stats`

Get server statistics.

**Response:**
```json
{
  "total": 15,
  "mobile": 10,
  "display": 5,
  "flowers": 1234
}
```

## Rate Limiting

- **Mobile clients:** 1 flower per 5 seconds (configurable)
- **Implementation:** In-memory map with sliding window
- **Cleanup:** Automatic every 60 seconds

## Validation

All incoming data is validated using Zod schemas:

- Flower type must be one of 6 valid types
- RGB values must be 0-255
- Petal count must be 5-12
- All required fields must be present

Invalid data triggers `mobile:plant_error` event.

## Database Schema

### Flower Table

```sql
CREATE TABLE flowers (
  id UUID PRIMARY KEY,
  flowerType VARCHAR NOT NULL,
  colorR INT NOT NULL,
  colorG INT NOT NULL,
  colorB INT NOT NULL,
  leaves VARCHAR NOT NULL,
  petalCount INT NOT NULL,
  positionX FLOAT NOT NULL,
  positionY FLOAT NOT NULL,
  rotation FLOAT NOT NULL,
  scale FLOAT NOT NULL,
  plantedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flowers_planted_at ON flowers(plantedAt);
```

## Garden Placement Algorithm

### Poisson Disc Sampling

1. Generate random position within bounds (with margin)
2. Check spatial hash for nearby flowers
3. If position valid (min distance satisfied), use it
4. If max attempts reached, fall back to grid placement

### Configuration

- `MIN_DISTANCE`: 30px (configurable)
- `MAX_ATTEMPTS`: 50
- `MARGIN`: 20px from edges

### Spatial Hashing

- Cell size: 50px
- Constant-time collision detection
- Updates on every flower placement
