package com.association.init;

import com.association.entity.Role;
import com.association.entity.User;
import com.association.repository.RoleRepository;
import com.association.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.username:}")
    private String adminUsername;

    @Value("${admin.email:}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> roleRepository.save(new Role(null, "ROLE_ADMIN")));
        Role memberRole = roleRepository.findByName("ROLE_MEMBER").orElseGet(() -> roleRepository.save(new Role(null, "ROLE_MEMBER")));

        if (adminUsername != null && !adminUsername.isBlank() && adminPassword != null && !adminPassword.isBlank()) {
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail != null ? adminEmail : adminUsername + "@example.com");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(adminRole);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("Created admin user: " + adminUsername);
            }
        }
    }
}
