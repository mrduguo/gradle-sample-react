package com.github.mrduguo.gradle.samplereact

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        System.properties['spring.profiles.active'] = System.properties['spring.profiles.active'] ?: System.properties['java.class.path'].contains('build/classes/main') ? 'local' : 'server'
        SpringApplication.run(Application.class, args)
    }

}
