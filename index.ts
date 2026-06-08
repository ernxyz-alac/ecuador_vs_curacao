// SERVER
Bun.serve({
    port: 9002,
    async fetch(request) {
        const url = new URL(request.url);
        
        // API routes
        if (url.pathname === "/data") {
            try {
                // Fetching for Ecuador vs Curazao: 15682183
                const response = await fetch("http://localhost:9001/data?gameId=15682183");
                const data = await response.json();
                return Response.json(data);
            } catch (error) {
                console.error("Error in /data endpoint:", error);
                return Response.json(
                    { error: "Failed to fetch data from shared server" },
                    { status: 500 }
                );
            }
        }
        
        // Serve index.html
        if (url.pathname === "/") {
            try {
                const htmlFile = Bun.file("index.html");
                const htmlContent = await htmlFile.text();
                return new Response(htmlContent, {
                    headers: { "Content-Type": "text/html" }
                });
            } catch (error) {
                console.error("Error reading index.html:", error);
                return new Response("Index file not found", { status: 404 });
            }
        }
        
        // Serve images with better error handling
        if (url.pathname === "/img/db.webp") {
            try {
                const imageFile = Bun.file("public/img/db.webp");
                const exists = await imageFile.exists();
                if (!exists) throw new Error("Image not found");
                
                return new Response(imageFile, {
                    headers: { 
                        "Content-Type": "image/webp",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            } catch (error) {
                console.error("Error serving db.webp:", error);
                return new Response("Image not found", { status: 404 });
            }
        }
        
        if (url.pathname === "/img/bg.jpeg") {
            try {
                const imageFile = Bun.file("public/img/bg.jpeg");
                const exists = await imageFile.exists();
                if (!exists) throw new Error("Image not found");
                
                return new Response(imageFile, {
                    headers: { 
                        "Content-Type": "image/jpeg",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            } catch (error) {
                console.error("Error serving bg.jpeg:", error);
                // Return a fallback background color instead of error
                return new Response("/* fallback background */", { status: 404 });
            }
        }
        
        return new Response("Not found", { status: 404 });
    },
});

console.log('runnin in port', 9002)
