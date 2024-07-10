FROM node:20-alpine AS node


# Builder stage

FROM node AS builder

# Use /app as the CWD
WORKDIR /app            

# Copy package.json and package-lock.json to /app
COPY server/package*.json ./   

# Install all dependencies
RUN npm i               

# Copy the rest of the code
COPY server .                

# Invoke the build script to transpile code to js
RUN npm run build       

FROM node AS fe_builder

# Use /app as the CWD
WORKDIR /fe_app            

# Copy package.json and package-lock.json to /app
COPY client/package*.json ./   

# Install all dependencies
RUN npm i               

# Copy the rest of the code
COPY client .                

# Invoke the build script to transpile code to js
RUN npm run build       

# Final stage


FROM node AS final

# Prepare a destination directory for js files
RUN mkdir -p /app/dist                  
RUN mkdir -p /app/dist/public/assets

# Use /app as CWD
WORKDIR /app                            

# Copy package.json and package-lock.json
COPY server/package*.json server/prisma ./                   

# Install only production dependencies
RUN npm i --only=production             

RUN npx prisma generate

# Copy transpiled js from builder stage into the final image
COPY --from=builder /app/dist ./dist
COPY --from=fe_builder /fe_app/dist_local/* ./dist/public/assets
COPY --from=fe_builder /fe_app/dist_local/index.html ./dist/public
COPY --from=fe_builder /fe_app/dist_local/*.jpg ./dist/public
COPY --from=fe_builder /fe_app/dist_local/*.png ./dist/public
COPY --from=fe_builder /fe_app/dist_local/*.webm ./dist/public
COPY --from=fe_builder /fe_app/dist_local/*.csv ./dist/public

# Open desired port
EXPOSE 3000

# Use js files to run the application
ENTRYPOINT ["node", "./dist/src/index.js"]
