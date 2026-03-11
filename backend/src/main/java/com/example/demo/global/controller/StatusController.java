package com.example.demo.global.controller;

import com.example.demo.global.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class StatusController {

    private final JdbcTemplate jdbcTemplate;
    private final RedisTemplate<String, String> redisTemplate;

    public StatusController(
            @Nullable JdbcTemplate jdbcTemplate,
            @Nullable RedisTemplate<String, String> redisTemplate
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/status")
    public ApiResponse<Map<String, Object>> status() {
        Map<String, Object> result = new HashMap<>();

        result.put("status", "ok");
        result.put("uptime", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);

        // DB 연결 확인
        String dbStatus = "down";
        try {
            if (jdbcTemplate != null) {
                jdbcTemplate.queryForObject("SELECT 1", Integer.class);
                dbStatus = "ok";
            }
        } catch (Exception e) {
            log.warn("DB 연결 확인 실패: {}", e.getMessage());
        }
        result.put("db", dbStatus);

        // Redis 연결 확인
        String redisStatus = "down";
        try {
            if (redisTemplate != null) {
                redisTemplate.execute((RedisCallback<String>) RedisConnection::ping);
                redisStatus = "ok";
            }
        } catch (Exception e) {
            log.warn("Redis 연결 확인 실패: {}", e.getMessage());
        }
        result.put("redis", redisStatus);

        return ApiResponse.ok(result);
    }
}
