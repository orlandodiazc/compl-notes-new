package ditod.compl_notes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ComplNotesApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComplNotesApplication.class, args);
    }

}
