package com.stayease.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SCHEME = "bearerAuth";

    @Bean
    public OpenAPI stayEaseOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("StayEase Hotel Booking API")
                .version("1.0.0")
                .description("""
                    REST API for the StayEase hotel booking platform.

                    **Authentication**
                    1. POST /api/auth/register or /api/auth/login to obtain a JWT.
                    2. Click "Authorize" and paste the token (without the `Bearer ` prefix).
                    3. All endpoints except register / login require the token.
                    4. POST /api/auth/logout invalidates the supplied token.

                    **Roles**
                    - ADMIN  → create / update / delete hotels
                    - MANAGER → create / update / delete / toggle rooms
                    - GUEST  → search hotels, view rooms, book, cancel
                    Invalid token or insufficient role → HTTP 403.
                    """))
            .addSecurityItem(new SecurityRequirement().addList(SCHEME))
            .components(new Components().addSecuritySchemes(SCHEME,
                new SecurityScheme()
                    .name(SCHEME)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Paste the JWT obtained from /api/auth/login")));
    }
}
