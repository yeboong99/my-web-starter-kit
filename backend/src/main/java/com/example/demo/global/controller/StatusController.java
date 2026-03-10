package com.example.demo.global.controller;

import com.example.demo.global.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StatusController {

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

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
        } catch (Exception ignored) {}
        result.put("db", dbStatus);

        // Redis 연결 확인
        String redisStatus = "down";
        try {
            if (redisTemplate != null) {
                redisTemplate.getConnectionFactory().getConnection().ping();
                redisStatus = "ok";
            }
        } catch (Exception ignored) {}
        result.put("redis", redisStatus);

        return ApiResponse.ok(result);
    }
}
