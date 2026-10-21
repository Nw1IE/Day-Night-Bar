# Backend Dockerfile (multistage)
# Stage 1: Build & publish the .NET app using the SDK image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the source code
COPY . ./

# Publish the app (Release) to /app/publish
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime image (ASP.NET Core)
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish/ ./

# Expose the default ASP.NET port (5000 for Kestrel)
EXPOSE 5000

# Run the application
ENTRYPOINT ["dotnet", "server.dll"]
