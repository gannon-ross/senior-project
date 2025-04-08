# AdultsOnlyDB Java Library

A simple Java helper library for connecting to our airline reservation database.  
Handles MySQL connections, and test flight queries no boilerplate required.

---

## 🚀 Quick Start

### ✅ Step 1: Add the JAR to Your Project

1. Copy the file `lib/dbhelper-1.0-SNAPSHOT.jar` into your project directory.
2. In IntelliJ:
   - Go to **File → Project Structure → Modules → Dependencies**
   - Click the **"+" → JARs or directories**
   - Select the JAR file you added
   - Choose **"Compile" scope**

---

### ✅ Step 2: Import the Library

In your Java file:

```java
import com.adultsonly.AdultsOnlyDB;
import java.sql.*;

use to connect with credentials
AdultsOnlyDB.connect();
//////////////////////////////

Simple example included