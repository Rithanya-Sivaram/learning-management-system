package net.breezeware.learning.management.system.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmbeddingDto {

    @Schema(example = "Health record", description = "The content of the item")
    private String content;

    @Schema(example = "f29a44c8-2e94-4891-9b3d-44c0dc0d52c6", description = "The unique referenceId for the content.")
    private UUID referenceId;
}
