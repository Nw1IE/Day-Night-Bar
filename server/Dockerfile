# Backend Dockerfile
# Use the official .NET ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy published output
COPY ./publish/ .

# Expose the default ASP.NET port (5000 for Kestrel)
EXPOSE 5000

# Set environment variables (optional, can be overridden at runtime)
# ENV ASPNETCORE_URLS=http://+:5000

# Run the application
ENTRYPOINT ["dotnet", "BarSite.dll"]
