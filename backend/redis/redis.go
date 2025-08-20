package redis

import (
	"github.com/redis/go-redis/v9"
)

func Init() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     "valkey:6379",
		Password: "", // No password set
		DB:       0,  // Use default DB
		Protocol: 2,  // Connection protocol
	})
	return client
}
