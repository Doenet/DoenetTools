FROM node:20-alpine AS node


# Builder stage

FROM node AS builder

# Use /app as the CWD
WORKDIR /app            

# Copy package.json and package-lock.json to /app
COPY package*.json ./   

# Install all dependencies
RUN npm i               

# Copy the rest of the code
COPY . .                

# Invoke the build script to transpile code to js
RUN npm run build       


# Final stage


FROM node AS final

# Prepare a destination directory for js files
RUN mkdir -p /app/dist                  

# Use /app as CWD
WORKDIR /app                            

# Copy package.json and package-lock.json
COPY package*.json prisma ./                   

# Install only production dependencies
RUN npm i --only=production             

RUN npx prisma generate

# Copy transpiled js from builder stage into the final image
COPY --from=builder /app/dist ./dist

# Open desired port
EXPOSE 3000

# Use js files to run the application
ENTRYPOINT ["node", "./dist/src/index.js"]
