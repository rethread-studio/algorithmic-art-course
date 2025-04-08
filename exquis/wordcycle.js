// Register the module globally
window.wordcycle = {};

(() => {
    // Animation state variables
    let s; // Section information
    let perimeter; // Total perimeter length
    let segmentLengths = []; // Array to store lengths of each segment
    let position = 0; // Current position along the perimeter
    let speed = 1; // Movement speed (pixels per frame)
    let char_spacing = 30; // Spacing between characters
    let displayText = [
        "This is generative art, this is also a rhombus",
        "This is t3xt, th3s3 @r3 @ls0 f1gur3s", 
        "This is c0d3, this is @ rh0mbus , this is @ ch0mbus", 
        "This is 4rt, this is t3xt, this is 4rtt3xt"
    ]; // Text to display
    let choice = Math.floor(Math.random() * displayText.length); // Randomly select a text
    displayText = displayText[choice];
    let frameCount = 0;
    let endingPhase = false;
    let endingProgress = 0;
    
    // Polygon animation variables with matching color scheme from the image
    const polygons = [
        { sides: 3, color: [120, 110, 170] },  // Triangle (lavender/purple)
        { sides: 4, color: [180, 180, 180] },  // Square (light gray)
        { sides: 5, color: [200, 200, 220] },  // Pentagon (very light lavender)
        { sides: 6, color: [170, 180, 100] }   // Hexagon (olive green)
    ];
    
    // Create a randomized mapping of which polygon goes to which anchor point
    let polygonAnchorMapping = [];
    
    // Random polygons within the rhombus
    let innerPolygons = [];
    
    async function init() {
        // Get the current section from the framework
        s = O_currentsection;

        // Define rhombus points using section's connection points
        const rhombusPoints = [
            { x: s.x1, y: s.y1 }, // Top
            { x: s.x2, y: s.y2 }, // Right
            { x: s.x3, y: s.y3 }, // Bottom
            { x: s.x4, y: s.y4 }  // Left
        ];
        
        // Calculate segment lengths and perimeter
        segmentLengths = [];
        for (let i = 0; i < 4; i++) {
            const nextIndex = (i + 1) % 4;
            const length = distance(
                rhombusPoints[i].x, rhombusPoints[i].y,
                rhombusPoints[nextIndex].x, rhombusPoints[nextIndex].y
            );
            segmentLengths.push(length);
        }
        
        perimeter = segmentLengths.reduce((sum, length) => sum + length, 0);
        frameCount = 0;
        position = 0;
        endingPhase = false;
        endingProgress = 0;
        
        // Create a random mapping of polygons to anchor points
        polygonAnchorMapping = createRandomAnchorMapping();
        
        // Generate random polygons within the rhombus
        generateInnerPolygons();
        
        return Promise.resolve();
    }
    
    // Generate random polygons within the rhombus
    function generateInnerPolygons() {
        innerPolygons = [];
        
        // Calculate the center of the rhombus
        const centerX = (s.x1 + s.x2 + s.x3 + s.x4) / 4;
        const centerY = (s.y1 + s.y2 + s.y3 + s.y4) / 4;
        
        // Determine a safe radius for placing random polygons
        const safeRadius = Math.min(
            O_sectionwidth, O_sectionheight
        ) * 0.35; // 35% of section size
        
        // Randomly decide between 2 or 3 inner polygons
        const numPolygons = Math.floor(random(2, 4)); // 2 or 3
        
        for (let i = 0; i < numPolygons; i++) {
            // Random angle around the center
            const angle = random(TWO_PI);
            
            // Random distance from center (not too close to center, not too close to edge)
            const distance = random(safeRadius * 0.2, safeRadius * 0.7);
            
            // Calculate position
            const x = centerX + cos(angle) * distance;
            const y = centerY + sin(angle) * distance;
            
            // Random polygon type
            const polygonType = Math.floor(random(polygons.length));
            
            // Random size (scaled by distance from center)
            const size = safeRadius * 0.2 + random(0.1) * safeRadius;
            
            // Add to inner polygons
            innerPolygons.push({
                x: x,
                y: y,
                size: size,
                type: polygonType,
                rotation: random(TWO_PI)
            });
        }
    }
    
    // Create a random mapping of which polygon goes to which anchor point
    function createRandomAnchorMapping() {
        // Create an array of anchor indices (0-3)
        const anchors = [0, 1, 2, 3];
        // Shuffle the array
        for (let i = anchors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
        }
        
        // Create mapping of polygon index to anchor index
        const mapping = [];
        for (let i = 0; i < polygons.length; i++) {
            // If we have more polygons than anchors, some anchors will get multiple polygons
            const anchorIndex = anchors[i % anchors.length];
            mapping.push({
                polygonIndex: i,
                anchorIndex: anchorIndex
            });
        }
        
        return mapping;
    }
    
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    function positionOnRhombus(pos) {
        pos = pos % perimeter; // Ensure position wraps around
        
        // Find which segment we're on
        let currentDistance = 0;
        for (let i = 0; i < 4; i++) {
            if (currentDistance + segmentLengths[i] >= pos) {
                // We're on this segment
                const segmentPosition = (pos - currentDistance) / segmentLengths[i];
                
                // Get start and end points of the segment
                const startX = s[`x${i+1}`];
                const startY = s[`y${i+1}`];
                const endX = s[`x${(i+1)%4+1}`]; 
                const endY = s[`y${(i+1)%4+1}`];
                
                // Calculate the center of the rhombus
                const centerX = (s.x1 + s.x2 + s.x3 + s.x4) / 4;
                const centerY = (s.y1 + s.y2 + s.y3 + s.y4) / 4;
                
                // Adjust segment position to stay away from vertices
                // This creates a safety margin near each endpoint
                const safeMargin = 0.05; // 5% safety margin on each end
                const safeSegmentPosition = safeMargin + segmentPosition * (1 - 2 * safeMargin);
                
                // Interpolate between start and end points with safety margin
                const x = startX + safeSegmentPosition * (endX - startX);
                const y = startY + safeSegmentPosition * (endY - startY);
                
                // Calculate direction toward center
                const dirX = centerX - x;
                const dirY = centerY - y;
                const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
                
                // Normalize direction
                const normDirX = dirX / dirLength;
                const normDirY = dirY / dirLength;
                
                // Move slightly inward (this helps text stay safely inside)
                const inwardOffset = 10; // pixels inward
                const insetX = x + normDirX * inwardOffset;
                const insetY = y + normDirY * inwardOffset;
                
                return { x: insetX, y: insetY, segment: i };
            }
            
            currentDistance += segmentLengths[i];
        }
        
        // Fallback (shouldn't reach here if calculations are correct)
        return { x: s.x1, y: s.y1, segment: 0 };
    }
    
    // Function to check if a point is inside the section bounds
    function isPointInBounds(x, y) {
        // Add a margin to ensure text is fully within bounds
        const margin = 12;
        return x >= margin && x <= O_sectionwidth - margin && 
               y >= margin && y <= O_sectionheight - margin;
    }
    
    // Enhanced polygon drawing function that ensures polygons stay within section boundaries
    function drawPolygon(centerX, centerY, size, sides, rotation = 0) {
        // Calculate the maximum possible size that would keep the polygon within bounds
        const maxDistX = Math.min(centerX, O_sectionwidth - centerX);
        const maxDistY = Math.min(centerY, O_sectionheight - centerY);
        
        // For regular polygons, the maximum distance from center to vertex is the size
        // Use the smaller of the two constraints to ensure we stay within bounds
        const maxSafeSize = Math.min(maxDistX, maxDistY) * 0.95; // 95% to stay safely within
        
        // If our requested size exceeds the safe size, scale it down
        const adjustedSize = Math.min(size, maxSafeSize);
        
        push();
        translate(centerX, centerY);
        rotate(rotation);
        
        beginShape();
        for (let i = 0; i < sides; i++) {
            const angle = TWO_PI * i / sides;
            const x = adjustedSize * cos(angle);
            const y = adjustedSize * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }
    
    // Draw a dotted line between two points
    function drawDottedLine(x1, y1, x2, y2, dotLength = 3, gapLength = 5) {
        const d = dist(x1, y1, x2, y2);
        const steps = d / (dotLength + gapLength);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const nextT = min((i + 0.5) / steps, 1);
            
            const startX = lerp(x1, x2, t);
            const startY = lerp(y1, y2, t);
            const endX = lerp(x1, x2, nextT);
            const endY = lerp(y1, y2, nextT);
            
            line(startX, startY, endX, endY);
        }
    }
    
    function draw() {
        try {
            // Move to the section
            push();
            translate(s.x, s.y);
            
            // BEIGE BACKGROUND to match the image
            colorMode(RGB, 255, 255, 255, 255); // Switch to RGB mode
            
            // Draw a beige rectangle for the section background
            fill(225, 220, 200);
            noStroke();
            rect(0, 0, O_sectionwidth, O_sectionheight);
            
            // Calculate section progress
            const sectionProgress = (O_counter % O_sectionduration) / O_sectionduration;
            
            // Check if we should enter ending phase (last 20% of the section duration)
            if (sectionProgress > 0.8 && !endingPhase) {
                endingPhase = true;
                endingProgress = 0;
            }
            
            // Update ending progress if in ending phase
            if (endingPhase) {
                // Map from 0.8-1.0 section progress to 0-1 ending progress
                endingProgress = map(sectionProgress, 0.8, 1, 0, 1);
                
                // Slow down the text animation
                speed = map(endingProgress, 0, 1, 2, 0.2);
            }
            
            // Draw the rhombus shape with white outline to match image
            stroke(255, 255, 255); // White outline
            strokeWeight(3);  // Thick line
            noFill();
            beginShape();
            vertex(s.x1, s.y1);
            vertex(s.x2, s.y2);
            vertex(s.x3, s.y3);
            vertex(s.x4, s.y4);
            endShape(CLOSE);
            
            // Update position
            position = (position + speed) % perimeter;
            
            // Draw text around the rhombus with better visibility
            // Only show if not in final frame or if in early ending phase
            if (!endingPhase || endingProgress < 0.7) {
                textSize(50); // Larger text size for readability
                textAlign(CENTER, CENTER);
                
                for (let i = 0; i < displayText.length; i++) {
                    // Calculate position for this character
                    let charPos = (position - i * char_spacing) % perimeter;
                    if (charPos < 0) charPos += perimeter;
                    
                    const { x, y } = positionOnRhombus(charPos);
                    
                    // Only draw characters that are within bounds
                    if (isPointInBounds(x, y)) {
                        // Dark blue/purple text to match image
                        fill(50, 45, 100);
                        text(displayText[i], x, y);
                    }
                }
            }
            
            // Draw ending polygon sequence if in ending phase but not final frame
            if (endingPhase && sectionProgress < 0.99) {
                // Determine which polygon to show based on ending progress
                const polygonIndex = Math.min(
                    Math.floor(endingProgress * polygons.length),
                    polygons.length - 1
                );
                
                // Use the mapping to determine which anchor point to use
                const anchorIndex = polygonAnchorMapping[polygonIndex].anchorIndex;
                const anchorX = s[`x${anchorIndex+1}`];
                const anchorY = s[`y${anchorIndex+1}`];
                
                // Calculate a requested size - LARGE
                const requestedSize = Math.min(O_sectionwidth, O_sectionheight) * 
                                    map(endingProgress, 0, 1, 0.1, 0.3);  // 30% of section size
                
                strokeWeight(5); // Match the style in image
                stroke(polygons[polygonIndex].color[0], 
                       polygons[polygonIndex].color[1], 
                       polygons[polygonIndex].color[2]);
                
                // More transparent fill to match image style
                fill(polygons[polygonIndex].color[0], 
                     polygons[polygonIndex].color[1], 
                     polygons[polygonIndex].color[2], 
                     150);
                
                // Draw regular polygon at the anchor point - will be constrained to section
                drawPolygon(
                    anchorX, anchorY,
                    requestedSize, polygons[polygonIndex].sides
                );
            }
            
            // Draw final static piece on the very last frame
            if (endingPhase && sectionProgress >= 0.99) {
                // BEIGE BACKGROUND to match the image
                fill(225, 220, 200);
                rect(0, 0, O_sectionwidth, O_sectionheight);
                
                // Draw the rhombus shape
                stroke(255, 255, 255); // White outline
                strokeWeight(5);
                noFill();
                beginShape();
                vertex(s.x1, s.y1);
                vertex(s.x2, s.y2);
                vertex(s.x3, s.y3);
                vertex(s.x4, s.y4);
                endShape(CLOSE);
                
                // Draw inner polygons with dotted lines to anchor points
                for (let innerPoly of innerPolygons) {
                    // Draw the polygon
                    strokeWeight(4);
                    stroke(polygons[innerPoly.type].color[0], 
                           polygons[innerPoly.type].color[1], 
                           polygons[innerPoly.type].color[2]);
                    
                    fill(polygons[innerPoly.type].color[0], 
                         polygons[innerPoly.type].color[1], 
                         polygons[innerPoly.type].color[2], 
                         150);
                    
                    drawPolygon(
                        innerPoly.x, innerPoly.y,
                        innerPoly.size, polygons[innerPoly.type].sides,
                        innerPoly.rotation
                    );
                    
                    // Draw dotted lines to each anchor point
                    strokeWeight(2.5);
                    stroke(polygons[innerPoly.type].color[0], 
                           polygons[innerPoly.type].color[1], 
                           polygons[innerPoly.type].color[2], 
                           80); // Low opacity
                    
                    // Draw to each anchor point
                    for (let i = 1; i <= 4; i++) {
                        drawDottedLine(
                            innerPoly.x, innerPoly.y,
                            s[`x${i}`], s[`y${i}`],
                            3, 5
                        );
                    }
                }
                
                // Draw all polygons at their assigned anchor points
                for (let i = 0; i < polygons.length; i++) {
                    // Get the mapping for this polygon
                    const mapping = polygonAnchorMapping[i];
                    const anchorIndex = mapping.anchorIndex;
                    
                    // Get the anchor point coordinates
                    const anchorX = s[`x${anchorIndex+1}`];
                    const anchorY = s[`y${anchorIndex+1}`];
                    
                    // Calculate requested size to match image (slightly smaller)
                    const requestedSize = Math.min(O_sectionwidth, O_sectionheight) * 0.25;
                    
                    // Set appearance to match image style
                    strokeWeight(4);
                    stroke(polygons[i].color[0], 
                           polygons[i].color[1], 
                           polygons[i].color[2]);
                    
                    // Semi-transparent fill to match image
                    fill(polygons[i].color[0], 
                         polygons[i].color[1], 
                         polygons[i].color[2], 
                         150);
                    
                    // Draw the polygon centered at the anchor point
                    drawPolygon(
                        anchorX, anchorY,
                        requestedSize, polygons[i].sides
                    );
                }
                
                // Calculate the center for the nested polygons and text circle
                const centerX = (s.x1 + s.x2 + s.x3 + s.x4) / 4;
                const centerY = (s.y1 + s.y2 + s.y3 + s.y4) / 4;
                
                // Find safe radius (distance to closest edge)
                const safeRadius = Math.min(
                    Math.min(centerX, O_sectionwidth - centerX),
                    Math.min(centerY, O_sectionheight - centerY)
                ) * 0.7; // 70% of the distance to stay safely inside
                
                // Draw nested polygons in the center (from largest to smallest)
                for (let i = polygons.length - 1; i >= 0; i--) {
                    const polygonSize = safeRadius * (1 - i * 0.15);
                    strokeWeight(2);
                    
                    // Use muted colors to match image
                    stroke(polygons[i].color[0], 
                           polygons[i].color[1], 
                           polygons[i].color[2]);
                    fill(polygons[i].color[0], 
                         polygons[i].color[1], 
                         polygons[i].color[2], 
                         150);
                    
                    // Use the boundary-safe drawing function for center polygons too
                    drawPolygon(
                        centerX, centerY,
                        polygonSize, polygons[i].sides,
                        -HALF_PI // Start from top
                    );
                }
                
                // Break text into words for better display
                const words = displayText.split(/\s+/);
                
                // Display the words in a circle
                textSize(36);
                textAlign(CENTER);
                textFont('monospace'); // Match font in image
                
                // Place words around a circle
                const wordCount = words.length;
                const textRadius = safeRadius * 0.6; // Slightly smaller than the polygons
                
                for (let i = 0; i < wordCount; i++) {
                    const angle = TWO_PI * i / wordCount - HALF_PI; // Start from the top
                    const x = centerX + textRadius * cos(angle);
                    const y = centerY + textRadius * sin(angle);
                    
                    push();
                    translate(x, y);
                    rotate(angle + HALF_PI); // Rotate text to face outward
                    
                    // Dark blue/purple text as shown in image
                    fill(50, 45, 100);
                    text(words[i], 0, 0);
                    pop();
                }
                
                // Also draw text moving around the rhombus in final frame
                textSize(40);
                textAlign(CENTER, CENTER);
                
                for (let i = 0; i < displayText.length; i++) {
                    // Final static position for the characters
                    const fixedPosition = (i * char_spacing) % perimeter;
                    
                    const { x, y } = positionOnRhombus(fixedPosition);
                    
                    // Only draw characters that are within bounds
                    if (isPointInBounds(x, y)) {
                        // Dark blue/purple text to match image
                        fill(50, 45, 100, 150); // Slightly transparent for final frame
                        text(displayText[i], x, y);
                    }
                }
                
                // Add final signature with black text as shown in image
                textSize(36);
                fill(0);
                noStroke();
                textAlign(CENTER, CENTER);
                text("ALGORITHMIC ART", O_sectionwidth / 2, O_sectionheight - 20);
            }
            
            frameCount++;
            pop();
        } catch (err) {
            console.error("Error in wordcycle draw:", err);
        }
    }
    
    // Register with the global object
    window.wordcycle = { init, draw };
})();