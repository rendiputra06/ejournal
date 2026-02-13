<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log successful web requests, avoid logging assets and AJAX if needed
        if (!app()->runningUnitTests() && $request->isMethod('GET') && !$request->expectsJson() && !str_starts_with($request->path(), 'api/')) {
            try {
                $ip = $request->ip();
                $agent = $request->userAgent();
                
                // Uniqueness check: Only log once per 24 hours for same IP and User Agent
                $logCacheKey = 'visitor_logged_' . md5($ip . $agent);
                
                if (!cache()->has($logCacheKey)) {
                    // Simple cache to avoid redundant lookups in same session/recently
                    $cacheKey = 'visitor_geo_' . $ip;
                    $geo = cache()->remember($cacheKey, now()->addDays(7), function () use ($ip) {
                        if ($ip === '127.0.0.1' || $ip === '::1') {
                            return null;
                        }
                        
                        $response = \Illuminate\Support\Facades\Http::get("http://ip-api.com/json/{$ip}");
                        if ($response->successful()) {
                            return $response->json();
                        }
                        return null;
                    });

                    \App\Models\Visitor::create([
                        'ip_address' => $ip,
                        'user_agent' => $agent,
                        'country' => $geo['country'] ?? 'Unknown',
                        'country_code' => $geo['countryCode'] ?? '??',
                        'city' => $geo['city'] ?? 'Unknown',
                        'referral' => $request->header('referer'),
                    ]);

                    // Mark as logged for the next 24 hours
                    cache()->put($logCacheKey, true, now()->addDay());
                }
            } catch (\Exception $e) {
                report($e);
            }
        }

        return $response;
    }
}
