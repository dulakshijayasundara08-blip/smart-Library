package com.smartlibrary.controller;

import com.smartlibrary.service.ReadingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Mapped to /api/wishlist to match the existing DiscoverContent / ReadingListContent
 * calls in the frontend (they predate this being wired up server-side).
 * NOTE: since there's no auth token yet, userId is passed explicitly - swap this for
 * "current user from session/JWT" once auth is hardened.
 */
@RestController
@RequestMapping("/api/wishlist")
public class ReadingListController {

    @Autowired private ReadingListService readingListService;

    @GetMapping
    public List<Map<String, Object>> getReadingList(@RequestParam Long userId) {
        return readingListService.getForUser(userId);
    }

    @PostMapping
    public void add(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long bookId = Long.valueOf(body.get("bookId").toString());
        readingListService.addToList(userId, bookId);
    }

    @PutMapping("/{bookId}")
    public void updateStatus(@PathVariable Long bookId, @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String status = (String) body.get("status");
        String note = (String) body.get("note");
        readingListService.updateStatus(userId, bookId, status, note);
    }

    @DeleteMapping("/{bookId}")
    public void remove(@PathVariable Long bookId, @RequestParam Long userId) {
        readingListService.remove(userId, bookId);
    }
}
