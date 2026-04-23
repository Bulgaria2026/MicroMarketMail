plugins {
    `java-library`
    `maven-publish`
}

val pkgVersion: String = Regex(""""version"\s*:\s*"([^"]+)"""")
    .find(file("package.json").readText())
    ?.groupValues?.get(1)
    ?: error("Could not read version from package.json")
val isRelease = System.getenv("RELEASE") == "true"

group = "com.noserbulgaria.micromarket"
version = if (isRelease) pkgVersion else "$pkgVersion-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(25))
    }
}

tasks.named<Jar>("jar") {
    into("email-templates") {
        from("out") { include("*.html") }
    }
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            artifactId = "email-templates"
            pom {
                name.set("MicroMarket Email Templates")
                description.set("HTML email templates (Thymeleaf-ready) for MicroMarket.")
                url.set("https://github.com/Bulgaria2026/MicroMarketMail")
            }
        }
    }
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/Bulgaria2026/MicroMarketMail")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
}
