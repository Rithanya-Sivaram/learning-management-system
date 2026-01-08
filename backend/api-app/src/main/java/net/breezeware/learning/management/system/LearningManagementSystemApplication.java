package net.breezeware.learning.management.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@PropertySources({ @PropertySource(value = { "classpath:dynamo-auth.properties" }) })
@ComponentScan(basePackages = { "net.breezeware.dynamo.auth.config", "net.breezeware.dynamo",
    "net.breezeware.dynamo.usermanagement", "net.breezeware.learning.management.system" })
@EnableJpaRepositories(basePackages = { "net.breezeware.learning.management.system", "net.breezeware.dynamo" })
@EntityScan(basePackages = { "net.breezeware.learning.management.system", "net.breezeware.dynamo" })
@EnableScheduling
public class LearningManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(LearningManagementSystemApplication.class, args);
    }
}
