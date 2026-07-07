package com.association.controller;

import com.association.dto.CreateUserRequest;
import com.association.dto.JwtResponse;
import com.association.dto.LoginRequest;
import com.association.entity.Role;
import com.association.entity.User;
import com.association.repository.RoleRepository;
import com.association.repository.UserRepository;
import com.association.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // create user - protected to admins
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("username_taken");
        }
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("email_taken");
        }

        String roleName = req.getRole() != null ? req.getRole() : "ROLE_MEMBER";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(null, roleName)));

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhone(req.getPhone());
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest login) {
        Optional<User> u = userRepository.findByUsername(login.getUsername());
        if (u.isEmpty()) return ResponseEntity.status(401).body("invalid_credentials");
        if (!passwordEncoder.matches(login.getPassword(), u.get().getPassword())) return ResponseEntity.status(401).body("invalid_credentials");

        String token = jwtUtils.generateToken(u.get().getUsername(), u.get().getRole().getName());
        return ResponseEntity.ok(new JwtResponse(token, u.get().getUsername(), u.get().getRole().getName()));
    }
}
