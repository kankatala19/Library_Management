package com.example.library_management.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .cors()
            .and()
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()

                // Books management
                .requestMatchers("/api/books/**").hasAnyAuthority("librarian", "admin")

                // Users management
                .requestMatchers("/api/users/**").hasAuthority("admin")

                // Borrow/Return operations
                .requestMatchers("/api/borrow/**").hasAnyAuthority("student", "librarian", "admin")

                // Reservations
                .requestMatchers(HttpMethod.POST, "/api/reservations/reserve").hasAnyAuthority("student", "librarian", "admin")
                .requestMatchers(HttpMethod.PUT, "/api/reservations/**").hasAnyAuthority("librarian", "admin")
                .requestMatchers(HttpMethod.GET, "/api/reservations/**").hasAnyAuthority("librarian", "admin")

                // Fines
                .requestMatchers(HttpMethod.POST, "/api/fines/create").hasAnyAuthority("librarian", "admin")
                .requestMatchers(HttpMethod.PUT, "/api/fines/pay/**").hasAnyAuthority("librarian", "admin")
                .requestMatchers(HttpMethod.GET, "/api/fines/all").hasAnyAuthority("librarian", "admin")
                .requestMatchers(HttpMethod.GET, "/api/fines/unpaid").hasAnyAuthority("librarian", "admin")
                .requestMatchers(HttpMethod.GET, "/api/fines/user/**").hasAnyAuthority("student", "librarian", "admin")

                // Any other request requires authentication
                .anyRequest().authenticated()
            )
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
