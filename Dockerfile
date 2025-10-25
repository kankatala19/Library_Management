# ===== Stage 1: Build backend =====
FROM maven:3.9.4-eclipse-temurin-20 AS build

WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the project (skip tests for faster builds)
RUN mvn clean package -DskipTests

# ===== Stage 2: Run backend =====
FROM eclipse-temurin:20-jre-alpine

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render will provide $PORT environment variable)
EXPOSE 9090

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
